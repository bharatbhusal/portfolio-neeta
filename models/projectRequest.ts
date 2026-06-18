import mongoose, { Schema } from "mongoose";

export type ProjectRequestDoc = mongoose.Document & {
	requestType: "logo_design";
	name: string;
	email: string;
	phone?: string;
	status: "pending" | "reviewed" | "accepted" | "declined";
	notes?: string;

	brandName: string;
	businessDescription?: string;
	targetAudience?: string;
	brandKeywords?: string[];
	logoFeeling?: string[];
	logoType?:
		| "text_logo"
		| "icon_logo"
		| "combination_logo"
		| "mascot_logo"
		| "abstract_logo";
	colors?: string;
	symbols?: string;
	inspiration?: string;
	usage?: string[];
	fileFormats?: string[];
	additionalNotes?: string;
};

const ProjectRequestSchema = new Schema<ProjectRequestDoc>(
	{
		requestType: {
			type: String,
			enum: ["logo_design"],
			default: "logo_design",
			required: true,
		},
		name: { type: String, required: true },
		email: { type: String, required: true },
		phone: { type: String },
		status: {
			type: String,
			enum: ["pending", "reviewed", "accepted", "declined"],
			default: "pending",
		},
		notes: { type: String },

		brandName: { type: String, required: true },
		businessDescription: { type: String },
		targetAudience: { type: String },
		brandKeywords: { type: [String], default: [] },
		logoFeeling: { type: [String], default: [] },
		logoType: {
			type: String,
			enum: [
				"text_logo",
				"icon_logo",
				"combination_logo",
				"mascot_logo",
				"abstract_logo",
			],
		},
		colors: { type: String },
		symbols: { type: String },
		inspiration: { type: String },
		usage: { type: [String], default: [] },
		fileFormats: { type: [String], default: [] },
		additionalNotes: { type: String },
	},
	{ timestamps: true },
);

const ProjectRequestModel =
	(mongoose.models.ProjectRequest as mongoose.Model<ProjectRequestDoc>) ||
	mongoose.model<ProjectRequestDoc>(
		"ProjectRequest",
		ProjectRequestSchema,
	);

export { ProjectRequestModel };
export default ProjectRequestModel;
