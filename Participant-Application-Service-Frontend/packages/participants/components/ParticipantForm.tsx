'use client';
import { useEffect, useState } from 'react';
import { App, Form, Input, Modal } from 'antd';
import axios from 'axios';
import { apiMessage } from '@/shared/errors';
import { participantsService } from '../participants.service';
import type { Participant } from '../participant.types';
import type { CreateParticipantDto } from '../dto/create-participant.dto';

interface Props {
  open: boolean;
  /** Pass a participant to edit it; leave empty to create a new one. */
  participant?: Participant | null;
  onClose: () => void;
  onSaved: (participant: Participant) => void;
}

export function ParticipantForm({ open, participant, onClose, onSaved }: Props) {
  const { message } = App.useApp();
  const [form] = Form.useForm<CreateParticipantDto>();
  const [saving, setSaving] = useState(false);
  const editing = Boolean(participant);

  useEffect(() => {
    if (!open) return;
    form.resetFields();
    if (participant) {
      form.setFieldsValue({
        name: participant.name,
        email: participant.email,
        organization: participant.organization ?? undefined,
        phone: participant.phone ?? undefined,
      });
    }
  }, [open, participant, form]);

  const submit = async (values: CreateParticipantDto) => {
    setSaving(true);
    try {
      const saved = participant
        ? await participantsService.update(participant.id, values)
        : await participantsService.create(values);
      message.success(editing ? 'Participant updated' : 'Participant created');
      onSaved(saved);
    } catch (error) {
      // The backend answers 500 (not 409) when the email is already registered.
      const duplicate = axios.isAxiosError(error) && error.response?.status === 500;
      message.error(duplicate ? 'Could not save: this email may already be registered.' : apiMessage(error, 'Could not save the participant'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title={editing ? 'Edit participant' : 'New participant'}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText={editing ? 'Save' : 'Create'}
      confirmLoading={saving}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" onFinish={submit} requiredMark="optional">
        <Form.Item name="name" label="Full name" rules={[{ required: true, whitespace: true, message: 'Name is required' }]}>
          <Input placeholder="Amina Hassan" />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Enter a valid email' }]}>
          <Input placeholder="amina@example.so" />
        </Form.Item>
        <Form.Item name="organization" label="Organization">
          <Input placeholder="SIMAD University" />
        </Form.Item>
        <Form.Item name="phone" label="Phone">
          <Input placeholder="+252 61 500 0000" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
