import { notFound } from 'next/navigation';
import { isValidKey, contentRegistry } from '@/lib/contentRegistry';
import { getContent } from '@/lib/content';
import ContentEditorClient from '../../../_components/ContentEditorClient';

export const dynamic = 'force-dynamic';

export default async function ContentEditorPage({ params }) {
  const { key } = await params;
  if (!isValidKey(key)) notFound();

  const meta = contentRegistry[key];
  const value = await getContent(key);

  return (
    <ContentEditorClient
      contentKey={key}
      label={meta.label}
      description={meta.description}
      initialValue={value}
    />
  );
}
