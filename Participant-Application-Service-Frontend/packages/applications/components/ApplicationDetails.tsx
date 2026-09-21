'use client';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Alert, App, Avatar, Button, Card, Col, Descriptions, Flex, Row, Select, Skeleton, Typography } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { apiMessage } from '@/shared/errors';
import { dash, formatDate, initials } from '@/shared/format';
import { PageHeader } from '@/packages/layout/PageHeader';
import { applicationsService } from '../applications.service';
import { APPLICATION_STATUSES, type Application, type ApplicationStatus } from '../application.types';
import { StatusTag } from './StatusTag';
import { ApplicationForm } from './ApplicationForm';

export function ApplicationDetails({ id }: { id: string }) {
  const { message } = App.useApp();
  const [application, setApplication] = useState<Application | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const load = useCallback(async () => {
    try {
      setApplication(await applicationsService.findOne(id));
      setError(null);
    } catch (e) {
      setError(apiMessage(e, 'Could not load this application'));
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  const changeStatus = async (status: ApplicationStatus) => {
    setSaving(true);
    try {
      setApplication(await applicationsService.update(id, { status }));
      message.success(`Status changed to ${status}`);
    } catch (e) {
      message.error(apiMessage(e, 'Could not change the status'));
    } finally {
      setSaving(false);
    }
  };

  if (error) return <Alert type="error" showIcon title={error} />;
  if (!application) return <Skeleton active />;
  const p = application.participant;

  return (
    <>
      <PageHeader
        title={<Flex align="center" gap={12}>Application <StatusTag status={application.status} /></Flex>}
        subtitle={`Submitted ${formatDate(application.createdAt)}`}
        extra={<Button icon={<EditOutlined />} onClick={() => setEditOpen(true)}>Edit</Button>}
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={15}>
          <Card title="Application details" className="page-card" style={{ height: '100%' }}>
            <Descriptions
              column={{ xs: 1, md: 2 }}
              items={[
                { key: 'workshop', label: 'Workshop ID', children: dash(application.workshopId) },
                { key: 'track', label: 'Track', children: dash(application.track) },
                { key: 'created', label: 'Submitted', children: formatDate(application.createdAt) },
                { key: 'updated', label: 'Last updated', children: formatDate(application.updatedAt) },
              ]}
            />
            <Flex align="center" gap={12} wrap style={{ marginTop: 16, padding: 16, background: '#f7f9fc', borderRadius: 10 }}>
              <Typography.Text strong>Change status</Typography.Text>
              <Select
                style={{ width: 170 }}
                value={application.status}
                loading={saving}
                options={APPLICATION_STATUSES.map((s) => ({ value: s, label: s[0].toUpperCase() + s.slice(1) }))}
                onChange={changeStatus}
              />
            </Flex>
          </Card>
        </Col>
        <Col xs={24} lg={9}>
          <Card title="Participant" className="page-card" style={{ height: '100%' }}>
            {p ? (
              <Flex vertical gap={12}>
                <Flex align="center" gap={12}>
                  <Avatar size={48} style={{ background: '#1f4e79' }}>{initials(p.name)}</Avatar>
                  <div>
                    <Link href={`/dashboard/participants/${application.participantId}`}><Typography.Text strong>{p.name}</Typography.Text></Link>
                    <br />
                    <Typography.Text type="secondary">{p.email}</Typography.Text>
                  </div>
                </Flex>
                <Descriptions
                  column={1}
                  size="small"
                  items={[
                    { key: 'org', label: 'Organization', children: dash(p.organization) },
                    { key: 'phone', label: 'Phone', children: dash(p.phone) },
                  ]}
                />
              </Flex>
            ) : (
              <Typography.Text type="secondary">{application.participantId}</Typography.Text>
            )}
          </Card>
        </Col>
      </Row>

      <ApplicationForm
        open={editOpen}
        application={application}
        onClose={() => setEditOpen(false)}
        onSaved={(saved) => { setEditOpen(false); setApplication(saved); }}
      />
    </>
  );
}
