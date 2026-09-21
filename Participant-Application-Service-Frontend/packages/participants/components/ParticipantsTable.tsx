'use client';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Alert, App, Avatar, Button, Card, Flex, Input, Popconfirm, Table, Typography } from 'antd';
import type { TableProps } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { apiMessage } from '@/shared/errors';
import { DEFAULT_PAGE_SIZE } from '@/shared/pagination';
import { dash, formatDay, initials } from '@/shared/format';
import { PageHeader } from '@/packages/layout/PageHeader';
import { participantsService } from '../participants.service';
import type { Participant } from '../participant.types';
import type { ParticipantSortField, QueryParticipantDto } from '../dto/query-participant.dto';
import { ParticipantForm } from './ParticipantForm';

const SORTABLE: ParticipantSortField[] = ['name', 'email', 'organization', 'createdAt'];

export function ParticipantsTable() {
  const { message } = App.useApp();
  const [query, setQuery] = useState<QueryParticipantDto>({ page: 1, limit: DEFAULT_PAGE_SIZE, sortBy: 'createdAt', order: 'desc' });
  const [rows, setRows] = useState<Participant[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Participant | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await participantsService.findAll(query);
      setRows(res.data);
      setTotal(res.meta.total);
      setError(null);
    } catch (e) {
      setError(apiMessage(e, 'Could not load participants'));
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    void load();
  }, [load]);

  const remove = async (p: Participant) => {
    try {
      await participantsService.remove(p.id);
      message.success(`${p.name} removed`);
      void load();
    } catch (e) {
      message.error(apiMessage(e, 'Could not remove the participant'));
    }
  };

  const onChange: TableProps<Participant>['onChange'] = (pagination, _filters, sorter) => {
    const s = Array.isArray(sorter) ? sorter[0] : sorter;
    const field = s?.field as ParticipantSortField | undefined;
    setQuery((q) => ({
      ...q,
      page: pagination.current ?? 1,
      limit: pagination.pageSize ?? DEFAULT_PAGE_SIZE,
      sortBy: field && SORTABLE.includes(field) && s.order ? field : 'createdAt',
      order: s?.order === 'ascend' ? 'asc' : 'desc',
    }));
  };

  const columns: TableProps<Participant>['columns'] = [
    {
      title: 'Participant',
      dataIndex: 'name',
      sorter: true,
      render: (name: string, p) => (
        <Flex align="center" gap={12}>
          <Avatar style={{ background: '#1f4e79', flexShrink: 0 }}>{initials(name)}</Avatar>
          <div style={{ lineHeight: 1.3 }}>
            <Link href={`/dashboard/participants/${p.id}`}><Typography.Text strong>{name}</Typography.Text></Link>
            <br />
            <Typography.Text type="secondary" style={{ fontSize: 13 }}>{p.email}</Typography.Text>
          </div>
        </Flex>
      ),
    },
    { title: 'Organization', dataIndex: 'organization', sorter: true, render: dash },
    { title: 'Phone', dataIndex: 'phone', render: dash },
    { title: 'Registered', dataIndex: 'createdAt', sorter: true, defaultSortOrder: 'descend', render: formatDay },
    {
      title: '',
      key: 'actions',
      align: 'right',
      width: 110,
      render: (_, p) => (
        <Flex gap={4} justify="flex-end">
          <Button type="text" icon={<EditOutlined />} aria-label="Edit" onClick={() => { setEditing(p); setFormOpen(true); }} />
          <Popconfirm title="Remove this participant?" description="They will be hidden from all lists." okText="Remove" okButtonProps={{ danger: true }} onConfirm={() => remove(p)}>
            <Button type="text" danger icon={<DeleteOutlined />} aria-label="Remove" />
          </Popconfirm>
        </Flex>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Participants"
        subtitle="Everyone registered for SomNOG workshops."
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditing(null); setFormOpen(true); }}>
            New participant
          </Button>
        }
      />

      {error && <Alert type="error" showIcon title={error} style={{ marginBottom: 16 }} />}

      <Card className="page-card" styles={{ body: { padding: 0 } }}>
        <Flex justify="space-between" align="center" wrap gap={12} style={{ padding: 16, borderBottom: '1px solid #f0f0f0' }}>
          <Input.Search
            allowClear
            placeholder="Search name, email or organization"
            style={{ maxWidth: 360 }}
            onSearch={(search) => setQuery((q) => ({ ...q, search: search.trim() || undefined, page: 1 }))}
          />
          <Typography.Text type="secondary">{total} participant{total === 1 ? '' : 's'}</Typography.Text>
        </Flex>
        <Table<Participant>
          rowKey="id"
          loading={loading}
          dataSource={rows}
          columns={columns}
          onChange={onChange}
          pagination={{ current: query.page, pageSize: query.limit, total, showSizeChanger: true, style: { paddingInline: 16 } }}
        />
      </Card>

      <ParticipantForm
        open={formOpen}
        participant={editing}
        onClose={() => setFormOpen(false)}
        onSaved={() => { setFormOpen(false); void load(); }}
      />
    </>
  );
}
