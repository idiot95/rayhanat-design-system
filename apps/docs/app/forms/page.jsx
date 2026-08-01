"use client";

import { useState } from "react";
import {
  Form, FormField, FieldSet, FormSection, FormActions, ValidationSummary,
  TextField, TextareaField, SelectField, useFieldIds,
  Input, Checkbox, Radio, Badge, Stack, Grid, Callout, Prose, CodeBlock
} from "@al-rayhaanat/system";
import { Page, Group, Demo } from "../../components/demo.jsx";

export default function FormsPage() {
  const [busy, setBusy] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [delivery, setDelivery] = useState("collect");

  const errors = showErrors
    ? {
        familyName: "A family name is required.",
        chapter: "Choose the chapter this record belongs to."
      }
    : {};

  return (
    <Page
      title="forms"
      description="FormField and the aria wiring it does for you. The label, the hint, the error and the control are connected by id — never by proximity."
      meta={<Badge tone="accent">11 exports</Badge>}
    >
      <Callout tone="info" title="The error replaces the hint">
        A field shows its hint or its error, never both. That is a contract, not a style
        choice: two descriptions on one control read as one run-on sentence to a screen
        reader.
      </Callout>

      <Group title="A form">
        <Demo name="Form · FormSection · TextField · SelectField · FormActions">
          <Form onSubmit={e => { e.preventDefault(); setBusy(true); setTimeout(() => setBusy(false), 900); }}>
            {showErrors && <ValidationSummary errors={errors} />}

            <FormSection title="Member" description="The name as it appears on the register." columns={2}>
              <TextField label="Family name" name="familyName" required
                error={errors.familyName} placeholder="Jariwala" />
              <TextField label="Given name" name="givenName" placeholder="Abdulqadir" />
              <SelectField label="Chapter" name="chapter" required error={errors.chapter}
                hint="Determines which register the record joins."
                options={["Bindery", "Endpaper", "Colophon", "Proof"]} />
              <TextField label="Reference" name="ref" optional
                hint="Leave blank and one will be assigned." />
            </FormSection>

            <FormSection title="Notes" columns={1}>
              <TextareaField label="Remarks" name="remarks" rows={3}
                hint="Visible to the archive office only." />
            </FormSection>

            <FormActions
              submitLabel="Save record"
              busy={busy}
              onCancel={() => setShowErrors(s => !s)}
              cancelLabel={showErrors ? "Clear errors" : "Show errors"}
            />
          </Form>
        </Demo>
      </Group>

      <Group title="Groups">
        <Demo name="FieldSet" note="Radio and checkbox groups need a fieldset and a legend, not a floating label.">
          <Grid min="260px" gap={6}>
            {/* Radio is controlled-only — it has no internal state and no
                defaultChecked, so the visual follows `checked` and nothing else. */}
            <FieldSet legend="Delivery" hint="How the register copy is sent." required>
              {[["collect", "Collect in person"], ["post", "By post"], ["none", "No copy"]].map(
                ([value, label]) => (
                  <Radio key={value} name="delivery" value={value} label={label}
                    checked={delivery === value} onChange={() => setDelivery(value)} />
                )
              )}
            </FieldSet>
            <FieldSet legend="Permissions" columns={1}>
              <Checkbox label="May approve registrations" />
              <Checkbox label="May export the register" defaultChecked />
              <Checkbox label="May delete records" />
            </FieldSet>
          </Grid>
        </Demo>
      </Group>

      <Group title="Building a custom control">
        <Demo name="FormField (render function)" note="children may be a render function receiving the props the control must spread.">
          <Stack gap={5}>
            <FormField
              label="Custom control"
              name="custom"
              hint="The render function receives id, name, invalid, aria-describedby and aria-invalid."
            >
              {p => <Input {...p} placeholder="Spread the props onto anything" />}
            </FormField>
            <CodeBlock caption="the props your control must spread">
              {'<FormField label="…" name="ref" hint="…">\n  {p => <MyControl {...p} />}\n</FormField>\n\n// or, for a control you do not own:\nconst ids = useFieldIds({ name, hint, error });'}
            </CodeBlock>
          </Stack>
        </Demo>

        <Demo name="useFieldIds()" note="The same wiring, without the wrapper.">
          <CodeBlock>{JSON.stringify(useFieldIds({ name: "chapter", hint: true, error: false }), null, 2)}</CodeBlock>
        </Demo>
      </Group>

      <Group title="React Hook Form">
        <Demo name="rhf" note="An optional adapter. react-hook-form is a peer dependency — the system does not pull it in.">
          <Prose>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>
              <code>rhf</code> maps a register call onto the props{" "}
              <code>FormField</code> expects, so validation state arrives as{" "}
              <code>error</code> without either side knowing about the other.
            </p>
          </Prose>
        </Demo>
      </Group>
    </Page>
  );
}
