import { auth } from '@clerk/nextjs/server';
import { getLinksByUserId } from '@/data/links';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LinkIcon } from 'lucide-react';
import { CreateLinkForm } from './components/create-link-form/CreateLinkForm';
import { LinkActions } from './components/link-actions/LinkActions';

export default async function DashboardPage() {
  const { userId } = await auth();
  const links = await getLinksByUserId(userId!);

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Your Links</h1>
        <CreateLinkForm />
      </div>
      {links.length === 0 ? (
        <p className="text-muted-foreground">You have no links yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {links.map((link) => (
            <Card key={link.id}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between gap-2 text-base">
                  <span className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" />/{link.slug}
                  </span>
                  <LinkActions id={link.id} slug={link.slug} url={link.url} />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground truncate">
                  {link.url}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Created {new Date(link.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
