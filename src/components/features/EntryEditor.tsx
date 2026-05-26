"use client";

import React, { useState, useRef, useCallback } from 'react';
import { X } from 'lucide-react';
import { Toast } from '@/components/ui/Toast';
import { EntryEditorActions } from '@/components/features/editor/EntryEditorActions';
import { EntryEditorBody } from '@/components/features/editor/EntryEditorBody';
import { EntryEditorHero } from '@/components/features/editor/EntryEditorHero';
import { EntryEditorImageStage } from '@/components/features/editor/EntryEditorImageStage';
import { EntryEditorSidebar } from '@/components/features/editor/EntryEditorSidebar';
import { useEntryEditorDraftBridge } from '@/hooks/useEntryEditorDraftBridge';
import { useEntryEditorFormState } from '@/hooks/useEntryEditorFormState';
import { useSaveShortcut } from '@/hooks/useKeyboardShortcut';
import entryService from '@/services/entryService';
import type { Entry } from '@/services/storage-repository';

// Use the unified Entry type from storage-repository

interface EntryEditorProps {
    mode?: 'create' | 'edit';
    initialEntry?: Entry;
    onClose?: () => void;
    mobileDraftMode?: boolean;
    onDraftStateChange?: () => void;
}

export function EntryEditor({
    mode = 'create',
    initialEntry,
    onClose,
    mobileDraftMode = false,
    onDraftStateChange,
}: EntryEditorProps) {
    const isEditMode = mode === 'edit';

    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [isPublishing, setIsPublishing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const {
        applyDraft,
        currentKeyword,
        draftSnapshot,
        figure,
        handleKeywordKeyDown,
        image,
        keywords,
        moment,
        narrative,
        removeKeyword,
        resetForm,
        setCurrentKeyword,
        setFigure,
        setImage,
        setMoment,
        setNarrative,
        setTitle,
        title,
    } = useEntryEditorFormState();
    const {
        clearDraftStorage,
        closeEditor,
        discardDraft,
        lastSaved,
    } = useEntryEditorDraftBridge({
        applyDraft,
        draftSnapshot,
        initialEntry,
        isEditMode,
        mobileDraftMode,
        onClose,
        onDraftStateChange,
        resetForm,
    });

    // --- Toast Helper ---
    const showToast = useCallback((message: string) => {
        setToastMessage(message);
        setToastVisible(true);
    }, []);

    // --- Save Shortcut ---
    useSaveShortcut(() => {
        handlePublish();
    }, !mobileDraftMode);

    // --- File Handlers ---
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Optimistic UI update
            const tempUrl = URL.createObjectURL(file);
            setImage(tempUrl);

            try {
                // Upload via adapter immediately
                const result = await entryService.uploadImage(file);
                if (result.success && result.url) {
                    setImage(result.url);
                } else {
                    showToast('Failed to process image');
                    setImage(null);
                }
            } catch {
                showToast('Error uploading image');
                setImage(null);
            }
        }
    };

    // --- Remove Image ---
    const handleRemoveImage = () => {
        setImage(null);
    };

    const handleDiscardDraft = async () => {
        await discardDraft();
        showToast('Local draft discarded');
    };

    // --- Publish Handler ---
    const handlePublish = async () => {
        if (isPublishing) return;
        setIsPublishing(true);

        const entryData: Entry = {
            title,
            figure,
            moment,
            narrative,
            keywords,
            imageUrl: image || undefined, // Adapter handles base64 fallback if needed
            dateCreated: initialEntry?.dateCreated || new Date().toISOString(),
        };

        try {
            console.info(`${isEditMode ? 'Updating' : 'Saving'} entry with service...`);
            const result = isEditMode && initialEntry?.id
                ? await entryService.updateEntry(initialEntry.id, entryData)
                : await entryService.saveEntry(entryData);

            if (!result) {
                console.error('Save returned undefined result');
                showToast('Failed to save. Please try again.');
                return;
            }

            console.info('Save result:', result);

            if (result.success) {
                console.info(`Entry ${isEditMode ? 'updated' : 'saved'} successfully:`, result.savedPath);
                showToast(isEditMode ? 'Moment Updated in Archive' : 'Moment Preserved in Archive');

                if (!isEditMode) {
                    await clearDraftStorage();
                }
            } else {
                console.error('Failed to save:', result.error);
                showToast(result.error ? `Failed: ${result.error}` : 'Failed to save. Please try again.');
            }
        } catch (error) {
            console.error('Publish failed with error:', error);
            showToast('Failed to save. Please try again.');
        } finally {
            setIsPublishing(false);
        }
    };

    // --- Phase 1: Image Uploader (Visual Anchor) ---
    if (!image) {
        return (
            <>
                <EntryEditorImageStage
                    fileInputRef={fileInputRef}
                    isEditMode={isEditMode}
                    mobileDraftMode={mobileDraftMode}
                    onClose={onClose}
                    onCloseEditor={closeEditor}
                    onImageUpload={handleImageUpload}
                />
                <Toast
                    message={toastMessage}
                    visible={toastVisible}
                    onClose={() => setToastVisible(false)}
                />
            </>
        );
    }

    // --- Phase 2: Edit in Place (Template Editor) ---
    return (
        <div className="relative min-h-screen bg-background selection:bg-primary/20">
            {onClose && (
                <button
                    onClick={() => void closeEditor()}
                    className="surface-panel fixed left-8 top-8 z-[60] rounded-full p-3 text-white transition-all hover:scale-110"
                    title="Close Editor"
                >
                    <X className="w-5 h-5" />
                </button>
            )}

            <EntryEditorHero
                fileInputRef={fileInputRef}
                image={image}
                isEditMode={isEditMode}
                onImageUpload={handleImageUpload}
                onRemoveImage={handleRemoveImage}
                onTitleChange={setTitle}
                title={title}
            />

            <div className="container mx-auto px-6 py-12 md:px-12 md:py-20 lg:grid lg:grid-cols-12 lg:gap-20">
                <EntryEditorSidebar
                    currentKeyword={currentKeyword}
                    figure={figure}
                    isEditMode={isEditMode}
                    keywords={keywords}
                    lastSaved={lastSaved}
                    mobileDraftMode={mobileDraftMode}
                    onFigureChange={setFigure}
                    onKeywordChange={setCurrentKeyword}
                    onKeywordKeyDown={handleKeywordKeyDown}
                    onRemoveKeyword={removeKeyword}
                />
                <EntryEditorBody
                    moment={moment}
                    narrative={narrative}
                    onMomentChange={setMoment}
                    onNarrativeChange={setNarrative}
                />
            </div>

            <EntryEditorActions
                isEditMode={isEditMode}
                isPublishing={isPublishing}
                mobileDraftMode={mobileDraftMode}
                onCloseEditor={closeEditor}
                onDiscardDraft={handleDiscardDraft}
                onPublish={handlePublish}
            />

            <Toast
                message={toastMessage}
                visible={toastVisible}
                onClose={() => setToastVisible(false)}
            />
        </div>
    );
}
