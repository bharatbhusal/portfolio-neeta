import mongoose, { Schema } from "mongoose";

export type ProjectDoc = mongoose.Document & {
	key: string;
	title: string;
	category: string;
	summary?: string;
	story?: string;
	description: string;
	year: string;
	featured: boolean;
	tags: string[];
	client?: string;
	link?: string;
	imageUrl?: string;
	downloadUrl?: string;
};

const ProjectSchema = new Schema<ProjectDoc>(
	{
		key: {
			type: String,
			required: true,
			unique: true,
			index: true,
		},
		title: { type: String, required: true },
		category: { type: String, required: true, index: true },
		summary: { type: String },
		story: { type: String },
		description: { type: String, required: true },
		year: { type: String, required: true },
		featured: { type: Boolean, default: false },
		tags: { type: [String], default: [] },
		client: { type: String },
		link: { type: String },
	},
	{ timestamps: true },
);

const ProjectModel =
	(mongoose.models.Project as mongoose.Model<ProjectDoc>) ||
	mongoose.model<ProjectDoc>("Project", ProjectSchema);

export { ProjectModel };
export default ProjectModel;
