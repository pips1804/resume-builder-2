import { useResumeStore } from "@/store/resumeStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function Field({ label, id, hint, ...props }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} {...props} />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function PersonalForm() {
  const { resume, updatePersonal } = useResumeStore();
  const p = resume.personal;

  const onChange = (field) => (e) => updatePersonal({ [field]: e.target.value });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          label="Full Name *"
          id="fullName"
          placeholder="Jhon Paul G. Manlapaz"
          value={p.fullName}
          onChange={onChange("fullName")}
        />
        <Field
          label="Job Title"
          id="jobTitle"
          placeholder="Admin and Multimedia Staff"
          value={p.jobTitle}
          onChange={onChange("jobTitle")}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          label="Email *"
          id="email"
          type="email"
          placeholder="you@example.com"
          value={p.email}
          onChange={onChange("email")}
        />
        <Field
          label="Phone"
          id="phone"
          placeholder="09936840763"
          value={p.phone}
          onChange={onChange("phone")}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          label="Location"
          id="location"
          placeholder="Anywhere St., Any City"
          value={p.location}
          onChange={onChange("location")}
        />
        <Field
          label="Website"
          id="website"
          placeholder="jhonpaulgm.vercel.app"
          value={p.website}
          onChange={onChange("website")}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          label="LinkedIn"
          id="linkedin"
          placeholder="linkedin.com/in/yourprofile"
          value={p.linkedin}
          onChange={onChange("linkedin")}
        />
        <Field
          label="GitHub"
          id="github"
          placeholder="github.com/yourhandle"
          value={p.github}
          onChange={onChange("github")}
        />
      </div>
    </div>
  );
}
