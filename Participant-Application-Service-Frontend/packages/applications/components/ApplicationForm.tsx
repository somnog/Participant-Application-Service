'use client';
import { useEffect, useRef, useState } from 'react';
import { App, Form, Input, Modal, Select } from 'antd';
import { apiMessage } from '@/shared/errors';
import { participantsService } from '@/packages/participants/participants.service';
import type { Participant } from '@/packages/participants/participant.types';
import { applicationsService } from '../applications.service';
import { APPLICATION_STATUSES, type Application } from '../application.types';
import type { CreateApplicationDto } from '../dto/create-application.dto';

interface Props {
  open: boolean;
  /** Pass an application to edit it; leave empty to create one. */
  application?: Application | null;
  /** When creating from a participant's page, the participant is already known. */
  fixedParticipant?: Participant;
  onClose: () => void;
  onSaved: (application: Application) => void;
}

const statusOptions = APPLICATION_STATUSES.map((s) => ({ value: s, label: s }));

export function ApplicationForm({ open, application, fixedParticipant, onClose, onSaved }: Props) {
  const { message } = App.useApp();
  const [form] = Form.useForm<CreateApplicationDto>();
  const [saving, setSaving] = useState(false);
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
  const [searching, setSearching] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const editing = Boolean(application);

  const searchParticipants = (search: string) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await participantsService.findAll({ search: search || undefined, limit: 20, sortBy: 'name', order: 'asc' });
        setOptions(res.data.map((p) => ({ value: p.id, label: `${p.name} — ${p.email}` })));
      } catch {
        setOptions([]);
      } finally {
        setSearching(false);
      }
    }, 300);
  };

  useEffect(() => {
    if (!open) return;
    form.resetFields();
    if (application) {
      form.setFieldsValue({
        participantId: application.participantId,
        workshopId: application.workshopId ?? undefined,
        track: application.track ?? undefined,
        status: application.status,
      });
    } else if (fixedParticipant) {
      form.setFieldsValue({ participantId: fixedParticipant.id, status: 'pending' });
    } else {
      form.setFieldsValue({ status: 'pending' });
      searchParticipants('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, application, fixedParticipant, form]);

  const submit = async (values: CreateApplicationDto) => {
    setSaving(true);
    try {
      const saved = application
        ? await applicationsService.update(application.id, {
            status: values.status,
            workshopId: values.workshopId,
            track: values.track,
          })
        : await applicationsService.create(values);
      message.success(editing ? 'Application updated' : 'Application submitted');
      onSaved(saved);
    } catch (error) {
      message.error(apiMessage(error, 'Could not save the application'));
    } finally {
      setSaving(false);
    }
  };

  const who = application?.participant ?? fixedParticipant;

  return (
    <Modal
      title={editing ? 'Edit application' : 'New application'}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText={editing ? 'Save' : 'Submit'}
      confirmLoading={saving}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" onFinish={submit} requiredMark="optional">
        {who ? (
          <Form.Item label="Participant">
            <Input value={`${who.name} — ${who.email}`} disabled />
            <Form.Item name="participantId" hidden><Input /></Form.Item>
          </Form.Item>
        ) : (
          <Form.Item name="participantId" label="Participant" rules={[{ required: true, message: 'Choose a participant' }]}>
            <Select
              showSearch={{ filterOption: false, onSearch: searchParticipants }}
              options={options}
              loading={searching}
              placeholder="Type a name or email"
              notFoundContent={searching ? 'Searching…' : 'No participant found'}
            />
          </Form.Item>
        )}
        <Form.Item name="workshopId" label="Workshop ID" tooltip="The id from the Workshop service, e.g. WS-2025-001">
          <Input placeholder="WS-2025-001" />
        </Form.Item>
        <Form.Item name="track" label="Track">
          <Input placeholder="Software Development & Microservices" />
        </Form.Item>
        <Form.Item name="status" label="Status">
          <Select options={statusOptions} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
