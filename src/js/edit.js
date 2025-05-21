/* =============================================================== *\
   Gutenberg Block: Details Dropdown – Edit-Komponente

   - Unterstützt verschachtelte Inhalte (InnerBlocks)
   - Ermöglicht das Hinzufügen von PDF- oder Link-Elementen
   - Drag & Drop für Sortierung via @dnd-kit
   - Zustand "hasContent" wird dynamisch gesetzt
\* =============================================================== */

import {
	MediaUpload,
	MediaUploadCheck,
	LinkControl,
	InnerBlocks,
} from "@wordpress/block-editor";
import { Button, TextControl } from "@wordpress/components";
import { useEffect, useRef, useState, Fragment } from "@wordpress/element";
import { useSelect } from "@wordpress/data";

import { DndContext, closestCenter } from "@dnd-kit/core";
import {
	SortableContext,
	arrayMove,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import SortableItem from "./utils/SortableItem";

// Hauptkomponente für den Edit-Modus des Blocks
const Edit = ({ attributes, setAttributes, clientId }) => {
	const { items } = attributes;
	const [isOpen, setIsOpen] = useState(false);
	const ALLOWED_BLOCKS = ["core/heading", "core/paragraph", "core/list"];
	const TEMPLATE = [
		["core/heading", { level: 3, placeholder: "Überschrift" }],
	];
	const blockRef = useRef();

	/* =============================================================== *\
	   Prüft, ob InnerBlocks Content enthalten → wird an hasContent übergeben
	\* =============================================================== */
	const hasInnerBlockContent = useSelect(
		(select) => {
			const block = select("core/block-editor").getBlock(clientId);
			return block?.innerBlocks?.length > 0;
		},
		[clientId],
	);

	useEffect(() => {
		setAttributes({ hasContent: hasInnerBlockContent });
	}, [hasInnerBlockContent]);

	// Neue PDF-Zeile hinzufügen
	const addPDF = () => {
		const newItems = [
			...items,
			{
				id: Date.now(),
				type: "pdf",
				url: "",
				title: "",
				opensInNewTab: true,
			},
		];
		setAttributes({ items: newItems });
	};

	// Neue Link-Zeile hinzufügen
	const addLink = () => {
		const newItems = [
			...items,
			{
				id: Date.now(),
				type: "link",
				url: "",
				title: "",
				opensInNewTab: false,
			},
		];
		setAttributes({ items: newItems });
	};

	// Item aktualisieren
	const updateItem = (id, newData) => {
		const newItems = items.map((item) =>
			item.id === id ? { ...item, ...newData } : item,
		);
		setAttributes({ items: newItems });
	};

	// Item entfernen
	const removeItem = (id) => {
		const newItems = items.filter((item) => item.id !== id);
		setAttributes({ items: newItems });
	};

	// Sortierung nach Drag & Drop übernehmen
	const handleDragEnd = (event) => {
		const { active, over } = event;
		if (active.id !== over.id) {
			const oldIndex = items.findIndex((item) => item.id === active.id);
			const newIndex = items.findIndex((item) => item.id === over.id);
			setAttributes({ items: arrayMove(items, oldIndex, newIndex) });
		}
	};

	return (
		<div className="details-dropdown-editor">
			{/* =============================================================== *\
				Header: Zusammenfassung, klickbar zum Ein-/Ausklappen
			\* =============================================================== */}
			<div
				className="details-editor-summary"
				onClick={() => setIsOpen(!isOpen)}
			>
				<span className="details-editor-summary-text">Details</span>
				<span
					className={`details-editor-summary-icon ${
						isOpen ? "open" : ""
					}`}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 320 512"
						width="16"
						height="16"
					>
						<path d="M321.9 256l-17 17L113 465l-17 17L62.1 448l17-17 175-175L79 81l-17-17L96 30.1l17 17L305 239l17 17z" />
					</svg>
				</span>
			</div>

			{/* Inhaltsbereich mit InnerBlocks */}
			{isOpen && (
				<div className="details-richtext-container">
					<InnerBlocks
						allowedBlocks={ALLOWED_BLOCKS}
						template={TEMPLATE}
						templateLock={false}
					/>
				</div>
			)}

			{/* Sortierbare Liste der Einträge */}
			{isOpen && (
				<DndContext
					collisionDetection={closestCenter}
					onDragEnd={handleDragEnd}
				>
					<SortableContext
						items={items.map((item) => item.id)}
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
												onChange={(newTitle) =>
													updateItem(item.id, {
														title: newTitle,
													})
												}
												__nextHasNoMarginBottom={true}
												__next40pxDefaultSize={true}
											/>
										</div>

										{/* PDF-Spezifische Felder */}
										{item.type === "pdf" ? (
											<div className="details-item-fields">
												<TextControl
													label="Pfad:"
													value={item.url}
													onChange={(newUrl) =>
														updateItem(item.id, {
															url: newUrl,
														})
													}
													className="details-textcontrol"
													__nextHasNoMarginBottom={
														true
													}
													__next40pxDefaultSize={true}
												/>
												<MediaUploadCheck>
													<MediaUpload
														allowedTypes={[
															"application/pdf",
														]}
														onSelect={(media) =>
															updateItem(
																item.id,
																{
																	url: media.url,
																},
															)
														}
														render={({ open }) => (
															<Button
																variant="secondary"
																onClick={open}
																className="details-upload-button"
															>
																PDF wählen
															</Button>
														)}
													/>
												</MediaUploadCheck>
											</div>
										) : (
											// LinkControl für externe oder interne Links
											<div className="details-item-field">
												<label className="details-field-label">
													URL:
												</label>
												<div className="details-link-control-wrapper">
													<LinkControl
														value={{
															url: item.url,
															title: item.title,
															opensInNewTab:
																item.opensInNewTab,
														}}
														onChange={(
															newLinkData,
														) => {
															const url =
																newLinkData.url ||
																"";
															let isExternal = false;
															try {
																const host =
																	new URL(
																		url,
																		location.origin,
																	).hostname;
																isExternal =
																	host !==
																	location.hostname;
															} catch (e) {
																isExternal = true;
															}
															updateItem(
																item.id,
																{
																	url,
																	title: newLinkData.title,
																	opensInNewTab:
																		!!newLinkData.opensInNewTab,
																	isExternal,
																},
															);
														}}
														withCreateSuggestion={
															true
														}
														forceIsEditingLink={
															true
														}
													/>
												</div>
											</div>
										)}

										{/* Aktionen: Verschieben & Entfernen */}
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
												onClick={() =>
													removeItem(item.id)
												}
												className="details-remove-button"
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

			{/* Buttons zum Hinzufügen von Einträgen */}
			{isOpen && (
				<div className="details-add-buttons">
					<Button variant="secondary" onClick={addPDF}>
						PDF hinzufügen
					</Button>
					<Button variant="secondary" onClick={addLink}>
						Link hinzufügen
					</Button>
				</div>
			)}
		</div>
	);
};

export default Edit;
