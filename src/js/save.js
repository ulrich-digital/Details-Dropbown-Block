import { InnerBlocks } from "@wordpress/block-editor";

const Save = ({ attributes = {} }) => {
	const { items = [], hasContent = false } = attributes;

	const hasValidLinks = items.some(
		(item) => item?.url && item?.title // ← ACHTUNG: UND statt ODER, sonst bekommst du „halbleere“ Links
	);

	const textClass = `details-richtext-content${hasContent ? " has_content" : ""}`;
	const listClass = `linkliste${hasValidLinks ? " has_content" : ""}`;

	return (
		<div className="details-dropdown-frontend">
			<div className="details-toggle" data-toggle="true">
				<span className="details-toggle-text">Details</span>
			</div>
			<div className="details-content" data-content="true">
				<div className={textClass}>
					{/* Wichtig: immer rendern, InnerBlocks.Content schreibt leere Paragraphs sonst nicht */}
					<InnerBlocks.Content />
				</div>
				<ul className={listClass}>
					{items.map((item) => {
						if (!item?.url || !item?.title) return null;

						const target =
							item.type === "pdf" || item.isExternal
								? "_blank"
								: "_self";
						const rel = "noopener noreferrer";
						const classes = [
							item.type === "pdf" ? "link--pdf" : "",
							item.isExternal
								? "link--external"
								: "link--internal",
						].join(" ").trim();

						return (
							<li key={item.id}>
								<a href={item.url} target={target} rel={rel} className={classes}>
									{item.title}
								</a>
							</li>
						);
					})}
				</ul>
			</div>
		</div>
	);
};

export default Save;
