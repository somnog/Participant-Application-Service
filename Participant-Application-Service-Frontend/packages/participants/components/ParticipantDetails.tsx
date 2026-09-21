'use client';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Alert, Avatar, Button, Card, Col, Descriptions, Flex, Row, Skeleton, Table, Typography } from 'antd';
import { EditOutlined, MailOutlined, PhoneOutlined, PlusOutlined } from '@ant-design/icons';
import { apiMessage } from '@/shared/errors';
import { dash, formatDate, formatDay, initials } from '@/shared/format';
import { PageHeader } from '@/packages/layout/PageHeader';
import { participantsService } from '../participants.service';
import type { Participant } from '../participant.types';
import { ParticipantForm } from './ParticipantForm';
import { StatusTag } from '@/packages/applications/components/StatusTag';
import { ApplicationForm } from '@/packages/applications/components/ApplicationForm';
import type { Application } from '@/packages/applications/application.types';

export function ParticipantDetails({ id }: { id: string }) {
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);

  const load = useCallback(async () => {
    try {
      setParticipant(await participantsService.findOne(id));
      setError(null);
    } catch (e) {
      setError(apiMessage(e, 'Could not load this participant'));
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  if (error) return <Alert type="error" showIcon title={error} />;
  if (!participant) return <Skeleton active />;

  const applications = participant.applications ?? [];

  return (
    <>
      <PageHeader
        title={participant.name}
        subtitle={`Registered ${formatDay(participant.createdAt)}`}
        extra={
          <>
            <Button icon={<EditOutlined />} onClick={() => setEditOpen(true)}>Edit</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setApplyOpen(true)}>New application</Button>
          </>
        }
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card className="page-card">
            <Flex vertical align="center" gap={8} style={{ paddingBottom: 16, borderBottom: '1px solid #f0f0f0', marginBottom: 16 }}>
              <Avatar size={72} style={{ background: '#1f4e79', fontSize: 26 }}>{initials(participant.name)}</Avatar>
              <Typography.Title level={4} style={{ margin: 0 }}>{participant.name}</Typography.Title>
              <Typography.Text type="secondary">{dash(participant.organization)}</Typography.Text>
            </Flex>
            <Descriptions
              column={1}
              size="small"
              items={[
                { key: 'email', label: <><MailOutlined style={{ marginRight: 6 }} />Email</>, children: participant.email },
                { key: 'phone', label: <><PhoneOutlined style={{ marginRight: 6 }} />Phone</>, children: dash(participant.phone) },
                { key: 'updated', label: 'Last updated', children: formatDate(participant.updatedAt) },
              ]}
            />
          </Card>
        </Col>
        <Col xs={24} lg={16}>
          <Card title={`Applications (${applications.length})`} className="page-card" styles={{ body: { padding: 0 } }}>
            <Table<Application>
              rowKey="id"
              dataSource={applications}
              pagination={false}
              locale={{ emptyText: 'No applications yet' }}
              columns={[
                { title: 'Workshop', dataIndex: 'workshopId', render: dash },
                { title: 'Track', dataIndex: 'track', render: dash },
                { title: 'Status', dataIndex: 'status', render: (s) => <StatusTag status={s} /> },
                { title: 'Submitted', dataIndex: 'createdAt', render: formatDay },
                { title: '', key: 'open', align: 'right', render: (_, a) => <Link href={`/dashboard/applications/${a.id}`}>Open</Link> },
              ]}
            />
          </Card>
        </Col>
      </Row>

      <ParticipantForm
        open={editOpen}
        participant={participant}
        onClose={() => setEditOpen(false)}
        onSaved={() => { setEditOpen(false); void load(); }}
      />
      <ApplicationForm
        open={applyOpen}
        fixedParticipant={participant}
        onClose={() => setApplyOpen(false)}
        onSaved={() => { setApplyOpen(false); void load(); }}
      />
    </>
  );
}
