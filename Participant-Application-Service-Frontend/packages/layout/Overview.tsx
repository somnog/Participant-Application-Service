'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Alert, Avatar, Card, Col, Flex, List, Progress, Row, Skeleton, Statistic, Typography } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, FileTextOutlined, SafetyCertificateOutlined, TeamOutlined } from '@ant-design/icons';
import { apiMessage } from '@/shared/errors';
import { formatDate, initials } from '@/shared/format';
import { participantsService } from '@/packages/participants/participants.service';
import { applicationsService } from '@/packages/applications/applications.service';
import { APPLICATION_STATUSES, type Application, type ApplicationStatus } from '@/packages/applications/application.types';
import { StatusTag } from '@/packages/applications/components/StatusTag';
import { PageHeader } from './PageHeader';

type Counts = { participants: number; applications: number } & Record<ApplicationStatus, number>;

const STAT_STYLE: Record<ApplicationStatus, { icon: React.ReactNode; color: string }> = {
  pending: { icon: <ClockCircleOutlined />, color: '#d48806' },
  approved: { icon: <CheckCircleOutlined />, color: '#1f4e79' },
  rejected: { icon: <CloseCircleOutlined />, color: '#cf1322' },
  enrolled: { icon: <SafetyCertificateOutlined />, color: '#389e0d' },
};

function StatCard({ title, value, icon, color, href }: { title: string; value?: number; icon: React.ReactNode; color: string; href: string }) {
  return (
    <Link href={href}>
      <Card hoverable className="page-card stat-card">
        <Flex align="center" gap={14}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}14`, color, display: 'grid', placeItems: 'center', fontSize: 20 }}>{icon}</div>
          <Statistic title={title} value={value ?? 0} loading={value === undefined} />
        </Flex>
      </Card>
    </Link>
  );
}

/** Counts come from meta.total, so each call asks for one row only. */
export function Overview() {
  const [counts, setCounts] = useState<Counts | null>(null);
  const [recent, setRecent] = useState<Application[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const one = { page: 1, limit: 1 };
    Promise.all([
      participantsService.findAll(one),
      applicationsService.findAll({ page: 1, limit: 5 }),
      ...APPLICATION_STATUSES.map((status) => applicationsService.findAll({ ...one, status })),
    ])
      .then(([p, a, ...byStatus]) => {
        const next = { participants: p.meta.total, applications: a.meta.total } as Counts;
        APPLICATION_STATUSES.forEach((s, i) => (next[s] = byStatus[i].meta.total));
        setCounts(next);
        setRecent(a.data);
      })
      .catch((e) => setError(apiMessage(e, 'Could not load the overview')));
  }, []);

  const pct = (n: number) => (counts && counts.applications ? Math.round((n / counts.applications) * 100) : 0);

  return (
    <>
      <PageHeader title="Overview" subtitle="Participants and their workshop applications at a glance." />
      {error && <Alert type="error" showIcon title={error} style={{ marginBottom: 16 }} />}

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} xl={8}>
          <StatCard title="Participants" value={counts?.participants} icon={<TeamOutlined />} color="#1f4e79" href="/dashboard/participants" />
        </Col>
        <Col xs={24} sm={12} xl={8}>
          <StatCard title="Applications" value={counts?.applications} icon={<FileTextOutlined />} color="#29a9e0" href="/dashboard/applications" />
        </Col>
        <Col xs={24} sm={12} xl={8}>
          <StatCard title="Enrolled" value={counts?.enrolled} icon={STAT_STYLE.enrolled.icon} color={STAT_STYLE.enrolled.color} href="/dashboard/applications" />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={10}>
          <Card title="Applications by status" className="page-card" style={{ height: '100%' }}>
            {!counts ? (
              <Skeleton active />
            ) : (
              <Flex vertical gap={18}>
                {APPLICATION_STATUSES.map((s) => (
                  <div key={s}>
                    <Flex justify="space-between" style={{ marginBottom: 4 }}>
                      <Flex gap={8} align="center" style={{ color: STAT_STYLE[s].color }}>
                        {STAT_STYLE[s].icon}
                        <Typography.Text style={{ textTransform: 'capitalize' }}>{s}</Typography.Text>
                      </Flex>
                      <Typography.Text strong>{counts[s]}</Typography.Text>
                    </Flex>
                    <Progress percent={pct(counts[s])} strokeColor={STAT_STYLE[s].color} showInfo={false} size="small" />
                  </div>
                ))}
              </Flex>
            )}
          </Card>
        </Col>
        <Col xs={24} lg={14}>
          <Card title="Latest applications" className="page-card" extra={<Link href="/dashboard/applications">View all</Link>} style={{ height: '100%' }}>
            {!recent ? (
              <Skeleton active />
            ) : (
              <List
                dataSource={recent}
                locale={{ emptyText: 'No applications yet' }}
                renderItem={(a) => (
                  <List.Item extra={<StatusTag status={a.status} />}>
                    <List.Item.Meta
                      avatar={<Avatar style={{ background: '#1f4e79' }}>{initials(a.participant?.name ?? '?')}</Avatar>}
                      title={<Link href={`/dashboard/applications/${a.id}`}>{a.participant?.name ?? a.participantId}</Link>}
                      description={`${a.workshopId ?? 'No workshop'} · ${a.track ?? 'No track'} · ${formatDate(a.createdAt)}`}
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>
      </Row>
    </>
  );
}
