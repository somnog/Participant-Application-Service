'use client';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Alert, App, Avatar, Button, Card, Flex, Input, Segmented, Select, Table, Typography } from 'antd';
import type { TableProps } from 'antd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { apiMessage } from '@/shared/errors';
import { DEFAULT_PAGE_SIZE } from '@/shared/pagination';
import { dash, formatDay, initials } from '@/shared/format';
import { PageHeader } from '@/packages/layout/PageHeader';
import { applicationsService } from '../applications.service';
import { APPLICATION_STATUSES, type Application, type ApplicationStatus } from '../application.types';
import type { QueryApplicationDto } from '../dto/query-application.dto';
import { StatusTag } from './StatusTag';
import { ApplicationForm } from './ApplicationForm';

const statusOptions = APPLICATION_STATUSES.map((s) => ({ value: s, label: s }));

export function ApplicationsTable() {
  const { message } = App.useApp();
  const [query, setQuery] = useState<QueryApplicationDto>({ page: 1, limit: DEFAULT_PAGE_SIZE });
  const [rows, setRows] = useState<Application[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [bulkStatus, setBulkStatus] = useState<ApplicationStatus>();
  const [bulkSaving, setBulkSaving] = useState(false);
  const [editing, setEditing] = useState<Application | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await applicationsService.findAll(query);
      setRows(res.data);
      setTotal(res.meta.total);
      setError(null);
    } catch (e) {
      setError(apiMessage(e, 'Could not load applications'));
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    void load();
  }, [load]);

  const filter = (patch: Partial<QueryApplicationDto>) => {
    setSelected([]);
    setQuery((q) => ({ ...q, ...patch, page: 1 }));
  };

  const applyBulk = async () => {
    if (!bulkStatus || selected.length === 0) return;
    setBulkSaving(true);
    try {
      const { updated } = await applicationsService.bulkUpdateStatus({ ids: selected, status: bulkStatus });
      message.success(`${updated} application(s) set to ${bulkStatus}`);
      setSelected([]);
      setBulkStatus(undefined);
      void load();
    } catch (e) {
      message.error(apiMessage(e, 'Could not update the applications'));
    } finally {
      setBulkSaving(false);
    }
  };

  const columns: TableProps<Application>['columns'] = [
    {
      title: 'Participant',
      key: 'participant',
      render: (_, a) => (
        <Flex align="center" gap={12}>
          <Avatar style={{ background: '#29a9e0', flexShrink: 0 }}>{initials(a.participant?.name ?? '?')}</Avatar>
          <div style={{ lineHeight: 1.3 }}>
            <Link href={`/dashboard/applications/${a.id}`}><Typography.Text strong>{a.participant?.name ?? a.participantId}</Typography.Text></Link>
            <br />
            <Typography.Text type="secondary" style={{ fontSize: 13 }}>{a.participant?.email ?? ''}</Typography.Text>
          </div>
        </Flex>
      ),
    },
    { title: 'Workshop', dataIndex: 'workshopId', render: dash },
    { title: 'Track', dataIndex: 'track', render: dash },
    { title: 'Status', dataIndex: 'status', render: (s: ApplicationStatus) => <StatusTag status={s} /> },
    { title: 'Submitted', dataIndex: 'createdAt', render: formatDay },
    {
      title: '',
      key: 'actions',
      align: 'right',
      width: 70,
      render: (_, a) => <Button type="text" icon={<EditOutlined />} aria-label="Edit" onClick={() => { setEditing(a); setFormOpen(true); }} />,
    },
  ];

  return (
    <>
      <PageHeader
        title="Applications"
        subtitle="Review, filter and update workshop applications."
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditing(null); setFormOpen(true); }}>
            New application
          </Button>
        }
      />

      {error && <Alert type="error" showIcon title={error} style={{ marginBottom: 16 }} />}

      <Card className="page-card" styles={{ body: { padding: 0 } }}>
        <Flex vertical gap={12} style={{ padding: 16, borderBottom: '1px solid #f0f0f0' }}>
          <Segmented
            value={query.status ?? 'all'}
            options={[{ label: 'All', value: 'all' }, ...APPLICATION_STATUSES.map((s) => ({ label: s[0].toUpperCase() + s.slice(1), value: s }))]}
            onChange={(v) => filter({ status: v === 'all' ? undefined : (v as ApplicationStatus) })}
          />
          <Flex gap={8} wrap align="center" justify="space-between">
            <Flex gap={8} wrap>
              <Input.Search allowClear placeholder="Workshop ID" style={{ width: 200 }} onSearch={(v) => filter({ workshopId: v.trim() || undefined })} />
              <Input.Search allowClear placeholder="Track" style={{ width: 240 }} onSearch={(v) => filter({ track: v.trim() || undefined })} />
            </Flex>
            <Typography.Text type="secondary">{total} application{total === 1 ? '' : 's'}</Typography.Text>
          </Flex>
          {selected.length > 0 && (
            <Flex gap={8} align="center" wrap style={{ padding: '8px 12px', background: '#eef4fb', borderRadius: 8 }}>
              <Typography.Text strong>{selected.length} selected</Typography.Text>
              <Select placeholder="Set status to…" style={{ width: 170 }} options={statusOptions} value={bulkStatus} onChange={setBulkStatus} />
              <Button type="primary" disabled={!bulkStatus} loading={bulkSaving} onClick={applyBulk}>Apply</Button>
              <Button type="text" onClick={() => setSelected([])}>Clear</Button>
            </Flex>
          )}
        </Flex>
        <Table<Application>
          rowKey="id"
          loading={loading}
          dataSource={rows}
          columns={columns}
          rowSelection={{ selectedRowKeys: selected, onChange: (keys) => setSelected(keys as string[]) }}
          onChange={(p) => setQuery((q) => ({ ...q, page: p.current ?? 1, limit: p.pageSize ?? DEFAULT_PAGE_SIZE }))}
          pagination={{ current: query.page, pageSize: query.limit, total, showSizeChanger: true, style: { paddingInline: 16 } }}
        />
      </Card>

      <ApplicationForm
        open={formOpen}
        application={editing}
        onClose={() => setFormOpen(false)}
        onSaved={() => { setFormOpen(false); void load(); }}
      />
    </>
  );
}
