import { InnerBlocks } from "@wordpress/block-editor";

const Save = ({ attributes }) => {
	const { items, hasContent } = attributes;

	if ((!items || items.length === 0) && !hasContent) {
		return null;
	}

	return (
		<div className="details-dropdown-frontend">
			<div className="details-toggle" data-toggle>
				<span className="details-toggle-text">Details</span>
			</div>
			<div className="details-content" data-content>
				<div className="details-richtext-content">
					<InnerBlocks.Content />
				</div>

				<ul className="linkliste">
					{items.map((item) => (
						<li key={item.id}>
							<a
								href={item.url}
								target={
									item.type === "pdf" || item.isExternal
										? "_blank"
										: "_self"
								}
								rel="noopener noreferrer"
								className={[
									item.type === "pdf" ? "link--pdf" : "",
									item.isExternal
										? "link--external"
										: "link--internal",
								]
									.join(" ")
									.trim()}
							>
								{item.title || item.url}
							</a>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default Save;
