// Hier kommt dein angepasstes index.js:

import { registerBlockType } from '@wordpress/blocks';
import { MediaUpload, MediaUploadCheck, LinkControl } from '@wordpress/block-editor';
import { Button, TextControl } from '@wordpress/components';
import { Fragment, useState } from '@wordpress/element';

import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { trash } from '@wordpress/icons';

import '.././editor.css'; // dein Editor CSS

function SortableItem({ id, children }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes}>
            {children({ listeners })}
        </div>
    );
}

registerBlockType('details-dropdown-block-ud/details-dropdown', {
    apiVersion: 2,
    title: 'Details Dropdown',
    icon: 'list-view',
    category: 'widgets',
    attributes: {
        items: {
            type: 'array',
            default: []
        }
    },

    edit: ({ attributes, setAttributes }) => {
        const { items } = attributes;
        const [isOpen, setIsOpen] = useState(false);

        const addPDF = () => {
            const newItems = [...items, {
                id: Date.now(),
                type: 'pdf',
                url: '',
                title: '',
                opensInNewTab: true
            }];
            setAttributes({ items: newItems });
        };

        const addLink = () => {
            const newItems = [...items, {
                id: Date.now(),
                type: 'link',
                url: '',
                title: '',
                opensInNewTab: false
            }];
            setAttributes({ items: newItems });
        };

        const updateItem = (id, newData) => {
            const newItems = items.map(item => item.id === id ? { ...item, ...newData } : item);
            setAttributes({ items: newItems });
        };

        const removeItem = (id) => {
            const newItems = items.filter(item => item.id !== id);
            setAttributes({ items: newItems });
        };

        const handleDragEnd = (event) => {
            const { active, over } = event;
            if (active.id !== over.id) {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);
                setAttributes({ items: arrayMove(items, oldIndex, newIndex) });
            }
        };

        return (
            <div className="details-dropdown-editor">
                <div className="details-editor-summary" onClick={() => setIsOpen(!isOpen)}>
                    <span className="details-editor-summary-text">Details</span>
                    <span className={`details-editor-summary-icon ${isOpen ? 'open' : ''}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="16" height="16">
                            <path d="M321.9 256l-17 17L113 465l-17 17L62.1 448l17-17 175-175L79 81l-17-17L96 30.1l17 17L305 239l17 17z"/>
                        </svg>
                    </span>
                </div>

                {isOpen && (
                    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext
                            items={items.map(item => item.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {items.map((item) => (
                                <SortableItem key={item.id} id={item.id}>
                                    {({ listeners }) => (
                                        <div className="details-item">
                                            <div className="details-item-field">
                                                <TextControl
                                                    label="Bezeichnung:"
                                                    value={item.title}
                                                    onChange={(newTitle) => updateItem(item.id, { title: newTitle })}
                                                />
                                            </div>

                                            {item.type === 'pdf' ? (
                                                <div className="details-item-fields">
                                                    <TextControl
                                                        label="Pfad:"
                                                        value={item.url}
                                                        onChange={(newUrl) => updateItem(item.id, { url: newUrl })}
                                                        className="details-textcontrol"
                                                    />
                                                    <MediaUploadCheck>
                                                        <MediaUpload
                                                            allowedTypes={['application/pdf']}
                                                            onSelect={(media) => updateItem(item.id, { url: media.url })}
                                                            render={({ open }) => (
                                                                <Button variant="secondary" onClick={open} className="details-upload-button">
                                                                    PDF wählen
                                                                </Button>
                                                            )}
                                                        />
                                                    </MediaUploadCheck>
                                                </div>
                                            ) : (
                                                <div className="details-item-field">
                                                    <label className="details-field-label">URL:</label>
                                                    <div className="details-link-control-wrapper">
                                                        <LinkControl
                                                            value={{
                                                                url: item.url,
                                                                title: item.title,
                                                                opensInNewTab: item.opensInNewTab
                                                            }}

															onChange={(newLinkData) => {
																const url = newLinkData.url || '';
																let isExternal = false;

																try {
																	const host = new URL(url, location.origin).hostname;
																	isExternal = host !== location.hostname;
																} catch (e) {
																	isExternal = true; // Fallback: unbekannte URL = extern
																}

																updateItem(item.id, {
																	url,
																	title: newLinkData.title,
																	opensInNewTab: !!newLinkData.opensInNewTab,
																	isExternal
																});
															}}

                                                            withCreateSuggestion={true}
                                                            forceIsEditingLink={true}
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            <div className="details-actions">
                                                <Button
                                                    variant="link"
                                                    {...listeners}
                                                    className="details-drag-button"
                                                >
                                                    ↑↓ Verschieben
                                                </Button>
                                                <Button
                                                    variant="secondary"
                                                    onClick={() => removeItem(item.id)}
                                                    className="details-remove-button"
                                                    icon={trash}
                                                >
                                                    Entfernen
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </SortableItem>
                            ))}
                        </SortableContext>
                    </DndContext>
                )}

                {isOpen && (
                    <div className="details-add-buttons">
                        <Button
                            variant="secondary"
                            onClick={addPDF}
                        >
                            PDF hinzufügen
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={addLink}
                        >
                            Link hinzufügen
                        </Button>
                    </div>
                )}
            </div>
        );
    },

save: ({ attributes }) => {
    const { items } = attributes;

    return (
        <div className="details-dropdown-frontend">
            <div className="details-toggle" data-toggle>
                <span className="details-toggle-text">Details</span>
                {/* Hier kannst du später deinen eigenen Chevron platzieren */}
            </div>
            <div className="details-content" data-content>
                <ul>
                    {items.map((item) => (
                        <li key={item.id}>
<a
  href={item.url}
target={(item.type === 'pdf' || item.isExternal) ? '_blank' : '_self'}
  rel="noopener noreferrer"
  className={[
    item.type === 'pdf' ? 'link--pdf' : '',
    item.isExternal ? 'link--external' : 'link--internal'
  ].join(' ').trim()}
>
  {item.title || item.url}
</a>

                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

});
