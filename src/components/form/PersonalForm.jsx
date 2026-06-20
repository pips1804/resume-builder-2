import { useResumeStore } from "@/store/resumeStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";

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
  const supportsPhoto = resume.meta.template === "classic-photo";

  const onChange = (field) => (e) => updatePersonal({ [field]: e.target.value });

  function handlePhotoUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (ev) => updatePersonal({ photo: ev.target.result });
    reader.readAsDataURL(file);
    e.target.value = "";
  }

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

      {supportsPhoto && (
        <div className="space-y-2 rounded-lg border p-4 bg-muted/30">
          <Label>Profile Photo</Label>
          <p className="text-xs text-muted-foreground">
            Appears at the top right of your resume header. Recommended: square image, at least 200×200 px.
          </p>
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md border bg-background flex items-center justify-center">
              {p.photo ? (
                <img src={p.photo} alt="Profile preview" className="h-full w-full object-cover" />
              ) : (
                <span className="text-[10px] text-muted-foreground text-center px-1">No photo</span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="profile-photo">
                <Button variant="outline" size="sm" asChild>
                  <span className="cursor-pointer">
                    <Upload className="h-4 w-4 mr-1.5" />
                    Upload photo
                  </span>
                </Button>
                <input
                  id="profile-photo"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
              </label>
              {p.photo && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive justify-start px-2"
                  onClick={() => updatePersonal({ photo: null })}
                >
                  <X className="h-4 w-4 mr-1" />
                  Remove photo
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
