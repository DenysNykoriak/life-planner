# Module: Forms (TanStack Form)

Optional module. Use when forms are complex enough to need dedicated field state and submission flow.

## Install

- `@tanstack/react-form`
- optionally `zod` for schema-first validation

## Recommended usage

- Create reusable field wrappers for consistent UI and validation rendering.
- Keep submit handlers thin and delegate API calls to hooks or data layers.
- Normalize backend validation errors before mapping to form fields.

## Conventions

- Keep typed defaults and submit payloads explicit.
- Keep one validation strategy across the app.
- For tiny forms, native state can be enough and this module can be skipped.

## Example: schema + form instance

```ts
import { useForm } from "@tanstack/react-form";
import { z } from "zod";

const schema = z.object({
	email: z.string().email(),
	password: z.string().min(1),
});

function SignInForm() {
	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		validators: {
			onSubmit: schema,
		},
		onSubmit: async ({ value }) => {
			await fetch("/api/sign-in", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(value),
			});
		},
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				void form.handleSubmit();
			}}
		>
			<form.Field name="email">
				{(field) => (
					<input
						value={field.state.value}
						onBlur={field.handleBlur}
						onChange={(e) => field.handleChange(e.target.value)}
					/>
				)}
			</form.Field>
			<button type="submit">Submit</button>
		</form>
	);
}
```

Design notes:

- Keep domain validation schemas next to the form or in a shared validators module.
- Keep API error-to-field mapping in one small helper per domain.
