'use client';

import { useState, useTransition } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { updateLinkAction, deleteLinkAction } from './actions';

interface LinkActionsProps {
  id: number;
  slug: string;
  url: string;
}

export function LinkActions({ id, slug, url }: LinkActionsProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [editSlug, setEditSlug] = useState(slug);
  const [editUrl, setEditUrl] = useState(url);
  const [editError, setEditError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    setEditError(null);

    startTransition(async () => {
      const result = await updateLinkAction({
        id,
        url: editUrl,
        slug: editSlug,
      });
      if ('error' in result) {
        setEditError(result.error);
      } else {
        setEditOpen(false);
      }
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteLinkAction({ id });
    });
  }

  return (
    <div className="flex items-center gap-2">
      {/* Edit */}
      <Dialog
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);
          if (open) {
            setEditSlug(slug);
            setEditUrl(url);
            setEditError(null);
          }
        }}
      >
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Edit link">
            <Pencil className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit link</DialogTitle>
            <DialogDescription>
              Update the destination URL or slug for this link.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEdit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-url">Destination URL</Label>
              <Input
                id="edit-url"
                type="url"
                placeholder="https://example.com"
                value={editUrl}
                onChange={(e) => setEditUrl(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-slug">Slug</Label>
              <Input
                id="edit-slug"
                type="text"
                placeholder="my-link"
                value={editSlug}
                onChange={(e) => setEditSlug(e.target.value)}
                required
              />
            </div>
            {editError && (
              <p className="text-sm text-destructive">{editError}</p>
            )}
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Saving...' : 'Save changes'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Delete link">
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete link</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>/{slug}</strong>? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isPending}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
