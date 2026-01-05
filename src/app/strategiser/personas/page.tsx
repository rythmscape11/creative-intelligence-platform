'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Users, Plus, Edit, Trash2, Save } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Persona {
    id: string;
    name: string;
    ageRange: string;
    industry: string;
    stage: string;
    description?: string;
    createdAt: string;
}

const DEFAULT_PERSONAS: Persona[] = [
    { id: '1', name: 'Enterprise Decision Maker', ageRange: '35-55', industry: 'Technology', stage: 'Consideration', createdAt: new Date().toISOString() },
    { id: '2', name: 'Small Business Owner', ageRange: '28-45', industry: 'Retail', stage: 'Awareness', createdAt: new Date().toISOString() },
    { id: '3', name: 'Marketing Manager', ageRange: '28-40', industry: 'B2B Services', stage: 'Decision', createdAt: new Date().toISOString() },
];

const STORAGE_KEY = 'aureon_personas';

export default function PersonasPage() {
    const [personas, setPersonas] = useState<Persona[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingPersona, setEditingPersona] = useState<Persona | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        ageRange: '',
        industry: '',
        stage: 'Awareness',
        description: '',
    });

    // Load personas from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            setPersonas(JSON.parse(stored));
        } else {
            // Initialize with defaults
            setPersonas(DEFAULT_PERSONAS);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PERSONAS));
        }
    }, []);

    // Save to localStorage whenever personas change
    const savePersonas = (newPersonas: Persona[]) => {
        setPersonas(newPersonas);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newPersonas));
    };

    const handleOpenDialog = (persona?: Persona) => {
        if (persona) {
            setEditingPersona(persona);
            setFormData({
                name: persona.name,
                ageRange: persona.ageRange,
                industry: persona.industry,
                stage: persona.stage,
                description: persona.description || '',
            });
        } else {
            setEditingPersona(null);
            setFormData({ name: '', ageRange: '', industry: '', stage: 'Awareness', description: '' });
        }
        setIsDialogOpen(true);
    };

    const handleSave = () => {
        if (!formData.name.trim()) return;

        if (editingPersona) {
            // Update existing
            const updated = personas.map(p =>
                p.id === editingPersona.id
                    ? { ...p, ...formData }
                    : p
            );
            savePersonas(updated);
        } else {
            // Create new
            const newPersona: Persona = {
                id: Date.now().toString(),
                ...formData,
                createdAt: new Date().toISOString(),
            };
            savePersonas([...personas, newPersona]);
        }
        setIsDialogOpen(false);
        setEditingPersona(null);
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this persona?')) {
            savePersonas(personas.filter(p => p.id !== id));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Target Personas</h1>
                    <p className="text-muted-foreground">Define and manage your target audience profiles</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-violet-600 hover:bg-violet-700" onClick={() => handleOpenDialog()}>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Persona
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingPersona ? 'Edit Persona' : 'Create New Persona'}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Persona Name *</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g., Enterprise Decision Maker"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="ageRange">Age Range</Label>
                                    <Input
                                        id="ageRange"
                                        placeholder="e.g., 35-55"
                                        value={formData.ageRange}
                                        onChange={(e) => setFormData({ ...formData, ageRange: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="industry">Industry</Label>
                                    <Input
                                        id="industry"
                                        placeholder="e.g., Technology"
                                        value={formData.industry}
                                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="stage">Buying Stage</Label>
                                <Select value={formData.stage} onValueChange={(v) => setFormData({ ...formData, stage: v })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Awareness">Awareness</SelectItem>
                                        <SelectItem value="Consideration">Consideration</SelectItem>
                                        <SelectItem value="Decision">Decision</SelectItem>
                                        <SelectItem value="Retention">Retention</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description (optional)</Label>
                                <Input
                                    id="description"
                                    placeholder="Brief description of this persona"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleSave} disabled={!formData.name.trim()}>
                                <Save className="mr-2 h-4 w-4" />
                                {editingPersona ? 'Update' : 'Create'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {personas.length === 0 ? (
                <Card className="p-8 text-center">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No personas created yet</p>
                    <Button className="mt-4" onClick={() => handleOpenDialog()}>Create your first persona</Button>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {personas.map((persona) => (
                        <Card key={persona.id}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900/50">
                                        <Users className="h-5 w-5 text-violet-600" />
                                    </div>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(persona)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(persona.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <CardTitle className="mt-2">{persona.name}</CardTitle>
                                {persona.description && (
                                    <p className="text-sm text-muted-foreground">{persona.description}</p>
                                )}
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Age Range</span>
                                    <span>{persona.ageRange || '-'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Industry</span>
                                    <span>{persona.industry || '-'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Buying Stage</span>
                                    <Badge variant="outline">{persona.stage}</Badge>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

