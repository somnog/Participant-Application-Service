import { Tag } from 'antd';
import { STATUS_COLOR, type ApplicationStatus } from '../application.types';

export function StatusTag({ status }: { status: ApplicationStatus }) {
  return (
    <Tag color={STATUS_COLOR[status]} bordered={false} style={{ textTransform: 'capitalize', fontWeight: 500, paddingInline: 10 }}>
      {status}
    </Tag>
  );
}
