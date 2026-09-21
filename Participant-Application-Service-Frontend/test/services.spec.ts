import { afterEach, describe, expect, it, vi } from 'vitest';
import api from '@/shared/ipconfig';
import { participantsService } from '@/packages/participants/participants.service';
import { applicationsService } from '@/packages/applications/applications.service';

const ok = <T>(data: T) => Promise.resolve({ data } as never);

afterEach(() => vi.restoreAllMocks());

describe('participantsService — matches participants.controller.ts', () => {
  it('GET /participants with only the filled query params', async () => {
    const get = vi.spyOn(api, 'get').mockReturnValue(ok({ data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } }));
    await participantsService.findAll({ search: '', page: 2, limit: 10, sortBy: 'name', order: 'asc' });
    expect(get).toHaveBeenCalledWith('/participants', { params: { page: 2, limit: 10, sortBy: 'name', order: 'asc' } });
  });

  it('POST /participants drops empty optional fields', async () => {
    const post = vi.spyOn(api, 'post').mockReturnValue(ok({ id: 'p1' }));
    await participantsService.create({ name: 'Amina', email: 'a@b.so', organization: '', phone: undefined });
    expect(post).toHaveBeenCalledWith('/participants', { name: 'Amina', email: 'a@b.so' });
  });

  it('PATCH /participants/:id and DELETE /participants/:id', async () => {
    const patch = vi.spyOn(api, 'patch').mockReturnValue(ok({ id: 'p1' }));
    const del = vi.spyOn(api, 'delete').mockReturnValue(ok(undefined));
    await participantsService.update('p1', { phone: '+252' });
    await participantsService.remove('p1');
    expect(patch).toHaveBeenCalledWith('/participants/p1', { phone: '+252' });
    expect(del).toHaveBeenCalledWith('/participants/p1');
  });
});

describe('applicationsService — matches applications.controller.ts', () => {
  it('GET /applications with a status filter', async () => {
    const get = vi.spyOn(api, 'get').mockReturnValue(ok({ data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } }));
    await applicationsService.findAll({ status: 'approved', page: 1, limit: 10 });
    expect(get).toHaveBeenCalledWith('/applications', { params: { status: 'approved', page: 1, limit: 10 } });
  });

  it('POST /applications/bulk-status sends { ids, status }', async () => {
    const post = vi.spyOn(api, 'post').mockReturnValue(ok({ updated: 2 }));
    const res = await applicationsService.bulkUpdateStatus({ ids: ['a1', 'a2'], status: 'enrolled' });
    expect(post).toHaveBeenCalledWith('/applications/bulk-status', { ids: ['a1', 'a2'], status: 'enrolled' });
    expect(res.updated).toBe(2);
  });
});
