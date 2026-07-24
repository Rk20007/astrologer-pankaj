import KundaliAdminDetail from '../../../_components/KundaliAdminDetail';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Kundali Request' };

export default async function AdminKundaliDetailPage({ params }) {
  const { id } = await params;
  return <KundaliAdminDetail id={id} />;
}
