import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Alert, Button, Card, Col, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import AgentPageBreadcrumb from "../components/AgentPageBreadcrumb";
import AgentProfileHeader from "../../shared/components/AgentProfileHeader";
import { useAuth } from "../../context/AuthContext";
import {
  getAgentById,
  subscribeAgents,
  updateAgentProfile,
} from "../../services/agentStore";
import { getPropertiesByAgentId } from "../../data/estateProperties";
import { getFollowerCount } from "../../services/agentFollowStore";
import type { AgentAvailability } from "../../types/user";
import { AGENT_SOCIAL_FIELDS } from "../../types/agentSocial";
import { normalizeSocialLinks } from "../../types/agentSocial";
import { getAgentProfilePath } from "../../shared/utils/agentDisplay";

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

const readImageFile = (file: File) =>
  new Promise<string>((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Please choose an image file."));
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      reject(new Error("Image must be 2 MB or smaller."));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read the image."));
    reader.readAsDataURL(file);
  });

const AgentProfileSettingsPage = () => {
  const { user, refresh: refreshSession } = useAuth();
  const [, refresh] = useState(0);
  const [bio, setBio] = useState("");
  const [availability, setAvailability] = useState<AgentAvailability>("available");
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => subscribeAgents(() => refresh((value) => value + 1)), []);

  const agent = user ? getAgentById(user.id) : undefined;

  useEffect(() => {
    if (!agent) return;
    setBio(agent.bio ?? "");
    setAvailability(agent.availability ?? "available");
    setSocialLinks({
      x: agent.socialLinks?.x ?? "",
      instagram: agent.socialLinks?.instagram ?? "",
      linkedin: agent.socialLinks?.linkedin ?? "",
      tiktok: agent.socialLinks?.tiktok ?? "",
      facebook: agent.socialLinks?.facebook ?? "",
      youtube: agent.socialLinks?.youtube ?? "",
    });
  }, [agent]);

  if (!user || user.role !== "agent" || !agent) {
    return null;
  }

  const listingCount = getPropertiesByAgentId(agent.id).length;
  const followerCount = getFollowerCount(agent.id);
  const publicProfilePath = getAgentProfilePath(agent.id);

  const handleImageUpload =
    (field: "avatarDataUrl" | "coverImageDataUrl") =>
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (!file) return;

      setError(null);
      setMessage(null);

      try {
        const dataUrl = await readImageFile(file);
        updateAgentProfile(agent.id, { [field]: dataUrl });
        refresh((value) => value + 1);
        refreshSession();
        setMessage(
          field === "coverImageDataUrl"
            ? "Cover image updated."
            : "Profile photo updated.",
        );
      } catch (uploadError) {
        setError(
          uploadError instanceof Error
            ? uploadError.message
            : "Could not upload image.",
        );
      }
    };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      updateAgentProfile(agent.id, {
        bio: bio.trim(),
        availability,
        socialLinks: normalizeSocialLinks(socialLinks),
      });
      refresh((value) => value + 1);
      setMessage("Profile saved.");
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : "Could not save profile.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <AgentPageBreadcrumb title="Public Profile" subName="Agent" />

      <Card className="border-0 shadow-sm mb-4 overflow-hidden">
        <AgentProfileHeader
          agent={agent}
          listingCount={listingCount}
          backTo="/agent/dashboard"
          backLabel="Dashboard"
        />
        <Card.Body className="border-top">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
            <p className="text-muted mb-0">
              {followerCount} {followerCount === 1 ? "follower" : "followers"} ·{" "}
              Preview matches your public profile
            </p>
            <Link to={publicProfilePath} className="btn btn-outline-primary btn-sm">
              View public profile
            </Link>
          </div>
        </Card.Body>
      </Card>

      {message && (
        <Alert variant="success" onClose={() => setMessage(null)} dismissible>
          {message}
        </Alert>
      )}
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Row className="g-4">
          <Col lg={6}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <h5 className="mb-3">Photos</h5>
                <Form.Group className="mb-3">
                  <Form.Label>Cover image</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload("coverImageDataUrl")}
                  />
                  <Form.Text className="text-muted">
                    Wide banner shown at the top of your profile. Max 2 MB.
                  </Form.Text>
                </Form.Group>
                <Form.Group className="mb-0">
                  <Form.Label>Profile photo</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload("avatarDataUrl")}
                  />
                  <Form.Text className="text-muted">
                    Square image works best. Max 2 MB.
                  </Form.Text>
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={6}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <h5 className="mb-3">About you</h5>
                <Form.Group className="mb-3">
                  <Form.Label>Availability</Form.Label>
                  <Form.Select
                    value={availability}
                    onChange={(event) =>
                      setAvailability(event.target.value as AgentAvailability)
                    }
                  >
                    <option value="available">Available</option>
                    <option value="away">Away</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-0">
                  <Form.Label>Bio</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    value={bio}
                    onChange={(event) => setBio(event.target.value)}
                    placeholder="Short description buyers will see on your profile."
                    maxLength={280}
                  />
                  <Form.Text className="text-muted">
                    {bio.length}/280 characters
                  </Form.Text>
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <h5 className="mb-3">Social links</h5>
                <Row className="g-3">
                  {AGENT_SOCIAL_FIELDS.map(({ key, label, placeholder }) => (
                    <Col md={6} key={key}>
                      <Form.Group>
                        <Form.Label>{label}</Form.Label>
                        <Form.Control
                          type="url"
                          value={socialLinks[key] ?? ""}
                          placeholder={placeholder}
                          onChange={(event) =>
                            setSocialLinks((current) => ({
                              ...current,
                              [key]: event.target.value,
                            }))
                          }
                        />
                      </Form.Group>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <div className="d-flex justify-content-end mt-4">
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? "Saving…" : "Save profile"}
          </Button>
        </div>
      </Form>
    </>
  );
};

export default AgentProfileSettingsPage;
