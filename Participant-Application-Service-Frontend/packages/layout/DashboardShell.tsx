'use client';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Breadcrumb, Flex, Layout, Menu, Tag, Typography } from 'antd';
import { DashboardOutlined, FileTextOutlined, TeamOutlined } from '@ant-design/icons';

const LINKS = [
  { key: '/dashboard', icon: <DashboardOutlined />, label: 'Overview' },
  { key: '/dashboard/participants', icon: <TeamOutlined />, label: 'Participants' },
  { key: '/dashboard/applications', icon: <FileTextOutlined />, label: 'Applications' },
];

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  // Longest matching prefix wins, so /dashboard/participants/123 highlights "Participants".
  const active = [...LINKS].sort((a, b) => b.key.length - a.key.length).find((l) => pathname.startsWith(l.key));
  const isDetail = active && pathname !== active.key;

  const crumbs = [
    { title: <Link href="/dashboard">Dashboard</Link> },
    ...(active && active.key !== '/dashboard' ? [{ title: isDetail ? <Link href={active.key}>{active.label}</Link> : active.label }] : []),
    ...(isDetail ? [{ title: 'Details' }] : []),
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout.Sider breakpoint="lg" collapsedWidth={0} width={240} theme="dark">
        <Flex align="center" gap={12} style={{ padding: '22px 20px 18px' }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: '#29a9e0', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 700 }}>
            S9
          </div>
          <div style={{ lineHeight: 1.25 }}>
            <Typography.Text strong style={{ color: '#fff', fontSize: 15 }}>SomNOG EMS</Typography.Text>
            <br />
            <Typography.Text style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12 }}>Participant & Application</Typography.Text>
          </div>
        </Flex>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={active ? [active.key] : []}
          items={LINKS.map((l) => ({ key: l.key, icon: l.icon, label: <Link href={l.key}>{l.label}</Link> }))}
          style={{ padding: '0 10px', borderInlineEnd: 0 }}
        />
      </Layout.Sider>
      <Layout>
        <Layout.Header style={{ borderBottom: '1px solid #eef0f3', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Breadcrumb items={crumbs} />
          <Tag color="blue" bordered={false}>participant-application-service</Tag>
        </Layout.Header>
        <Layout.Content style={{ padding: 24, maxWidth: 1320, width: '100%', margin: '0 auto' }}>{children}</Layout.Content>
      </Layout>
    </Layout>
  );
}
