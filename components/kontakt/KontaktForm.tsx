'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function KontaktForm() {
    // TODO: Implementovať odoslanie formulára (napr. server action)
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        alert('Odoslanie formulára ešte nie je implementované.');
        // Tu by sa volala server action alebo API endpoint
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <Label htmlFor="name">Meno</Label>
                <Input id="name" name="name" type="text" placeholder="Vaše meno" required />
            </div>
            <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="vas@email.sk" required />
            </div>
            <div>
                <Label htmlFor="subject">Predmet</Label>
                <Input id="subject" name="subject" type="text" placeholder="Predmet správy" />
            </div>
            <div>
                <Label htmlFor="message">Správa</Label>
                <Textarea id="message" name="message" placeholder="Vaša správa..." required rows={5} />
            </div>
            <Button type="submit">Odoslať Správu</Button>
        </form>
    );
}
