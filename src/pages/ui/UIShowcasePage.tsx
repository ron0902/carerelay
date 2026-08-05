import { useState } from "react";

import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  DataTable,
  EmptyState,
  Input,
  Modal,
  Spinner,
} from "../../components/ui";

export default function UIShowcasePage() {
      const [openModal, setOpenModal] = useState(false);

      const columns = [
      { header: "Name", accessor: "name" as const },
      { header: "Role", accessor: "role" as const },
      { header: "Status", accessor: "status" as const },
    ];

    const data = [
      {
        name: "John Doe",
        role: "Caregiver",
        status: "Active",
      },
      {
        name: "Jane Smith",
        role: "Patient",
        status: "Pending",
      },
      {
        name: "Bruce Wayne",
        role: "Administrator",
        status: "Active",
      },
    ];

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-6xl mx-auto space-y-8">

        <h1 className="text-4xl font-bold">
          CareRelay UI Showcase
        </h1>

        <Card>
          <h2 className="text-xl font-semibold mb-4">Buttons</h2>

          <div className="flex flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="success">Success</Button>
            <Button variant="warning">Warning</Button>
            <Button variant="danger">Danger</Button>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-4">Inputs</h2>

          <div className="space-y-4">
            <Input
              label="Email"
              placeholder="Enter email"
            />

            <Input
              label="Password"
              type="password"
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-4">Badges</h2>

          <div className="flex gap-3 flex-wrap">
            <Badge>Primary</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="danger">Danger</Badge>
            <Badge variant="secondary">Secondary</Badge>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-4">Avatars</h2>

          <div className="flex gap-5">
            <Avatar name="John Doe" size="sm" status="online" />
            <Avatar name="Jane Smith" size="md" status="busy" />
            <Avatar name="Peter Parker" size="lg" status="offline" />
            <Avatar name="Bruce Wayne" size="xl" status="online" />
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-4">Spinner</h2>

          <div className="flex items-center gap-5">
            <Spinner size="sm" />
            <Spinner size="md" />
            <Spinner size="lg" />

            <div className="bg-blue-600 rounded-lg p-4">
              <Spinner color="white" />
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-4">Alerts</h2>

          <div className="space-y-4">
            <Alert variant="success" title="Success">
              Patient record saved.
            </Alert>

            <Alert variant="info" title="Information">
              New caregiver assigned.
            </Alert>

            <Alert variant="warning" title="Warning">
              Session expires soon.
            </Alert>

            <Alert variant="danger" title="Error">
              Unable to connect.
            </Alert>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-4">Modal</h2>

          <Button onClick={() => setOpenModal(true)}>
            Open Modal
          </Button>
        </Card>

        <Modal
          open={openModal}
          title="CareRelay Modal"
          onClose={() => setOpenModal(false)}
        >
          <p className="mb-4">
            This is our reusable modal.
          </p>

          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => setOpenModal(false)}
            >
              Cancel
            </Button>

            <Button>Confirm</Button>
          </div>
        </Modal>

        <Card>
            <h2 className="mb-4 text-xl font-semibold">
                Empty State
            </h2>

            <EmptyState
                title="No Patients Found"
                description="There are currently no patient records available."
                action={
                <Button>
                    Add Patient
                </Button>
                }
            />
            </Card>

            <Card>
            <h2 className="mb-4 text-xl font-semibold">
              Data Table
            </h2>

            <DataTable
              columns={columns}
              data={data}
            />
          </Card>

      </div>
    </div>
  );
}