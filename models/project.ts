import mongoose, { Schema } from "mongoose";

export type ProjectDoc = mongoose.Document & {
	key: string;
	title: string;
	category?: string;
	story?: string;
	description?: string;
	year?: string;
	featured?: boolean;
	tags?: string[];
	client?: string;
	link?: string;
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
		category: { type: String, index: true },
		story: { type: String },
		description: { type: String },
		year: {
			type: String,
			default: () => new Date().getFullYear(),
		},
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
