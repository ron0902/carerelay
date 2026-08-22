import { useEffect, useState } from "react";
import { Button, Card, EmptyState } from "../../components/ui";
import { ClipboardList, Pencil, Plus, Trash2 } from "lucide-react";
import { getPatients } from "../../services/patientService";
import { getCaregivers } from "../../services/caregiverService";
import {
  createCarePlan,
  deleteCarePlan,
  getCarePlans,
  updateCarePlan,
  type CarePlan,
} from "../../services/carePlanService";

type Option = { id: number; name: string };
type FormState = Omit<CarePlan, "id" | "patient_name" | "caregiver_name">;

const emptyForm: FormState = {
  patient_id: 0,
  caregiver_id: 0,
  assignment_id: null,
  title: "",
  diagnosis: "",
  care_goal: "",
  medications: "",
  instructions: "",
  start_date: "",
  end_date: null,
  status: "Active",
};

export default function CarePlansPage() {
  const [plans, setPlans] = useState<CarePlan[]>([]);
  const [patients, setPatients] = useState<Option[]>([]);
  const [caregivers, setCaregivers] = useState<Option[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [planResponse, patientResponse, caregiverResponse] = await Promise.all([
        getCarePlans(),
        getPatients(),
        getCaregivers(),
      ]);

      setPlans(planResponse.success ? planResponse.care_plans || [] : []);
      setPatients(
        patientResponse.success
          ? (patientResponse.patients || []).map((item: any) => ({
              id: Number(item.id),
              name: `${item.first_name ?? ""} ${item.last_name ?? ""}`.trim(),
            }))
          : []
      );
      setCaregivers(
        caregiverResponse.success
          ? (caregiverResponse.caregivers || []).map((item: any) => ({
              id: Number(item.id),
              name: `${item.first_name ?? ""} ${item.last_name ?? ""}`.trim(),
            }))
          : []
      );
    } catch (error) {
      console.error("Failed to load care plans:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setShowForm(true);
  };

  const openEdit = (plan: CarePlan) => {
    setEditingId(plan.id);
    setForm({
      patient_id: plan.patient_id,
      caregiver_id: plan.caregiver_id,
      assignment_id: plan.assignment_id,
      title: plan.title,
      diagnosis: plan.diagnosis || "",
      care_goal: plan.care_goal,
      medications: plan.medications || "",
      instructions: plan.instructions || "",
      start_date: plan.start_date,
      end_date: plan.end_date,
      status: plan.status,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.patient_id || !form.caregiver_id || !form.title || !form.care_goal || !form.start_date) {
      window.alert("Patient, caregiver, title, care goal, and start date are required.");
      return;
    }

    try {
      setSaving(true);
      const response = editingId
        ? await updateCarePlan({ ...form, id: editingId })
        : await createCarePlan(form);
      if (!response.success) {
        window.alert(response.message || "Unable to save care plan.");
        return;
      }
      setShowForm(false);
      await loadData();
    } catch (error) {
      console.error("Failed to save care plan:", error);
      window.alert("Failed to save care plan.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this care plan?")) return;

    try {
      const response = await deleteCarePlan(id);
      if (!response.success) {
        window.alert(response.message || "Unable to delete care plan.");
        return;
      }
      setPlans((previous) => previous.filter((plan) => plan.id !== id));
    } catch (error) {
      console.error("Failed to delete care plan:", error);
    }
  };

  const updateField = (field: keyof FormState, value: string | number | null) => {
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Care Plans</h1>
          <p className="text-gray-500">Create and manage patient care instructions.</p>
        </div>
        <Button onClick={openCreate} className="inline-flex items-center gap-2 whitespace-nowrap">
          <Plus size={18} /> New Care Plan
        </Button>
      </div>

      {showForm && (
        <Card className="p-6">
          <div className="mb-5 flex items-center gap-3">
            <ClipboardList className="text-blue-600" />
            <h2 className="text-xl font-semibold">{editingId ? "Edit Care Plan" : "New Care Plan"}</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <select className="rounded-lg border p-3" value={form.patient_id || ""} onChange={(event) => updateField("patient_id", Number(event.target.value))}>
              <option value="">Select patient</option>
              {patients.map((patient) => <option key={patient.id} value={patient.id}>{patient.name}</option>)}
            </select>
            <select className="rounded-lg border p-3" value={form.caregiver_id || ""} onChange={(event) => updateField("caregiver_id", Number(event.target.value))}>
              <option value="">Select caregiver</option>
              {caregivers.map((caregiver) => <option key={caregiver.id} value={caregiver.id}>{caregiver.name}</option>)}
            </select>
            <input className="rounded-lg border p-3" placeholder="Plan title" value={form.title} onChange={(event) => updateField("title", event.target.value)} />
            <input className="rounded-lg border p-3" placeholder="Diagnosis" value={form.diagnosis} onChange={(event) => updateField("diagnosis", event.target.value)} />
            <textarea className="rounded-lg border p-3 md:col-span-2" rows={2} placeholder="Care goal" value={form.care_goal} onChange={(event) => updateField("care_goal", event.target.value)} />
            <textarea className="rounded-lg border p-3" rows={3} placeholder="Medications" value={form.medications} onChange={(event) => updateField("medications", event.target.value)} />
            <textarea className="rounded-lg border p-3" rows={3} placeholder="Instructions" value={form.instructions} onChange={(event) => updateField("instructions", event.target.value)} />
            <label className="text-sm text-gray-600">Start date<input type="date" className="mt-1 w-full rounded-lg border p-3" value={form.start_date} onChange={(event) => updateField("start_date", event.target.value)} /></label>
            <label className="text-sm text-gray-600">End date<input type="date" className="mt-1 w-full rounded-lg border p-3" value={form.end_date || ""} onChange={(event) => updateField("end_date", event.target.value || null)} /></label>
            <select className="rounded-lg border p-3" value={form.status} onChange={(event) => updateField("status", event.target.value)}>
              <option value="Active">Active</option><option value="Completed">Completed</option><option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="mt-5 flex justify-end gap-3"><Button variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button><Button onClick={() => void handleSave()} disabled={saving}>{saving ? "Saving..." : "Save Care Plan"}</Button></div>
        </Card>
      )}

      {loading ? <Card className="p-6"><p className="text-gray-500">Loading care plans...</p></Card> : plans.length === 0 ? <Card className="p-6"><EmptyState title="No care plans found" description="Create a care plan to make instructions available during caregiver visits." /></Card> : (
        <div className="space-y-4">
          {plans.map((plan) => (
            <Card key={plan.id} className="p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3"><h2 className="text-xl font-semibold text-slate-900">{plan.title}</h2><span className={`rounded-full px-3 py-1 text-sm font-medium ${plan.status === "Active" ? "bg-green-100 text-green-700" : plan.status === "Completed" ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"}`}>{plan.status}</span></div>
                  <p className="mt-2 text-sm text-slate-500">Patient: <span className="font-medium text-slate-700">{plan.patient_name}</span> <span className="mx-2 text-slate-300">|</span> Caregiver: <span className="font-medium text-slate-700">{plan.caregiver_name}</span></p>
                  {plan.diagnosis && <p className="mt-3 text-sm text-slate-500">Diagnosis: <span className="text-slate-700">{plan.diagnosis}</span></p>}
                  <div className="mt-5 grid gap-4 border-t border-slate-100 pt-4 md:grid-cols-3">
                    <PlanSummary label="Care goal" value={plan.care_goal} />
                    <PlanSummary label="Medications" value={plan.medications} />
                    <PlanSummary label="Instructions" value={plan.instructions} />
                  </div>
                  <p className="mt-5 text-xs text-slate-500">Active from {plan.start_date}{plan.end_date ? ` through ${plan.end_date}` : ""}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="inline-flex h-9 w-9 items-center justify-center p-0"
                    title="Edit care plan"
                    aria-label="Edit care plan"
                    onClick={() => openEdit(plan)}
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    className="inline-flex h-9 w-9 items-center justify-center p-0"
                    title="Delete care plan"
                    aria-label="Delete care plan"
                    onClick={() => void handleDelete(plan.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function PlanSummary({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{value || "Not provided"}</p>
    </div>
  );
}
