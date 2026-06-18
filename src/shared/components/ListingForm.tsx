import { useRef, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Row,
} from "react-bootstrap";
import ListingImageUpload from "../../agent/components/ListingImageUpload";
import {
  formatNairaPrice,
  formatPropertyPrice,
  stripPriceDigits,
} from "../../utils/nairaPrice";
import type { ListingImageFile } from "../../agent/utils/listingImages";
import {
  ABOUT_HIGHLIGHT_OPTIONS,
  AMENITY_OPTIONS,
  defaultListingFeatures,
  FAQ_TEMPLATES,
  FLOOR_PLAN_LABELS,
  PROPERTY_CATEGORIES,
  type FloorPlanType,
  type ListingFAQ,
  type ListingFormInput,
} from "../../types/listing";

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT",
  "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi",
  "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo",
  "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
];

const FEATURE_TOGGLES: {
  key: keyof ListingFormInput["features"];
  label: string;
  options: string[];
}[] = [
  { key: "parking", label: "Parking", options: ["Yes", "No", "2 spaces", "3+ spaces"] },
  { key: "balcony", label: "Balcony", options: ["Yes", "No"] },
  { key: "smartHome", label: "Smart Home", options: ["Yes", "No"] },
  { key: "generator", label: "Generator", options: ["Yes", "Stand-by", "No"] },
  { key: "solar", label: "Solar", options: ["Yes", "Optional", "No"] },
  { key: "bq", label: "BQ", options: ["Yes", "No"] },
  { key: "intercom", label: "Intercom", options: ["Yes", "No"] },
  { key: "outdoorKitchen", label: "Outdoor Kitchen", options: ["Yes", "No"] },
  { key: "laundry", label: "Laundry", options: ["Yes", "Pantry", "No"] },
  { key: "furnishing", label: "Furnishing", options: ["Furnished", "Semi-Furnished", "Unfurnished", "Fitted"] },
];

type ListingFormProps = {
  initial?: Partial<ListingFormInput>;
  onSubmit: (input: ListingFormInput) => Promise<void> | void;
  submitLabel?: string;
  showOwnerLockFields?: boolean;
};

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const ListingForm = ({
  initial,
  onSubmit,
  submitLabel = "Submit for Review",
  showOwnerLockFields = false,
}: ListingFormProps) => {
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [images, setImages] = useState<ListingImageFile[]>(
    initial?.images?.map((image) => ({
      id: image.id,
      name: image.name,
      dataUrl: image.dataUrl,
    })) ?? [],
  );
  const [coverImageId, setCoverImageId] = useState(
    initial?.coverImageId ?? initial?.images?.[0]?.id ?? "",
  );
  const [form, setForm] = useState({
    title: initial?.title ?? "",
    listingType: initial?.listingType ?? ("sale" as "sale" | "rent"),
    category: initial?.category ?? "Detached Duplex",
    city: initial?.city ?? "",
    state: initial?.state ?? "Lagos",
    address: initial?.address ?? "",
    price: initial?.price ? formatPropertyPrice(initial.price) : "",
    priceLabel: initial?.priceLabel ?? "",
    beds: initial?.beds ?? 3,
    baths: initial?.baths ?? 3,
    sqft: initial?.sqft ?? "",
    description: initial?.description ?? "",
    shortDescription: initial?.shortDescription ?? "",
    descriptionExtra: initial?.descriptionExtra ?? "",
    videoUrl: initial?.videoUrl ?? "",
    mapAddress: initial?.mapAddress ?? "",
    highlights: initial?.highlights ?? [],
    amenities: initial?.amenities ?? [],
    features: initial?.features ?? defaultListingFeatures(),
    faqs: initial?.faqs ?? [],
    nearbyLandmarks: initial?.nearbyLandmarks ?? [],
    ownerContact: initial?.ownerContact ?? {
      phone: "",
      email: "",
      whatsapp: "",
      location: "",
      lockedByAdmin: false,
      useCompanyDetails: false,
    },
  });
  const [floorPlans, setFloorPlans] = useState<
    Record<FloorPlanType, string | undefined>
  >({
    balcony: initial?.floorPlans?.find((p) => p.type === "balcony")?.dataUrl,
    front_hall: initial?.floorPlans?.find((p) => p.type === "front_hall")?.dataUrl,
    kitchen: initial?.floorPlans?.find((p) => p.type === "kitchen")?.dataUrl,
    full_building: initial?.floorPlans?.find((p) => p.type === "full_building")?.dataUrl,
  });
  const floorPlanRefs = useRef<Record<FloorPlanType, HTMLInputElement | null>>({
    balcony: null,
    front_hall: null,
    kitchen: null,
    full_building: null,
  });

  const toggleStringList = (key: "highlights" | "amenities", value: string) => {
    setForm((prev) => {
      const list = prev[key];
      return {
        ...prev,
        [key]: list.includes(value)
          ? list.filter((item) => item !== value)
          : [...list, value],
      };
    });
  };

  const addFaqTemplate = (templateIndex: number) => {
    const template = FAQ_TEMPLATES[templateIndex];
    if (!template) return;
    const faq: ListingFAQ = {
      id: crypto.randomUUID(),
      ...template,
    };
    setForm((prev) => ({ ...prev, faqs: [...prev.faqs, faq] }));
  };

  const handleFloorPlanUpload = async (type: FloorPlanType, file?: File) => {
    if (!file) return;
    const dataUrl = await readFileAsDataUrl(file);
    setFloorPlans((prev) => ({ ...prev, [type]: dataUrl }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!form.title.trim() || !form.city.trim() || !form.price.trim()) {
      setError("Please fill in title, city, and price.");
      return;
    }
    if (images.length === 0) {
      setError("Please upload at least one property photo.");
      return;
    }

    const resolvedCover =
      coverImageId || images[0]?.id || images[0]?.id || "";

    setSubmitting(true);
    try {
      await onSubmit({
        ...initial,
        title: form.title.trim(),
        listingType: form.listingType,
        category: form.category,
        city: form.city.trim(),
        state: form.state,
        address: form.address.trim() || `${form.city}, ${form.state}, Nigeria`,
        price: formatPropertyPrice(form.price),
        priceLabel:
          form.priceLabel.trim() ||
          (form.listingType === "rent" ? "per annum" : undefined),
        beds: form.beds,
        baths: form.baths,
        sqft: form.sqft.trim() || "—",
        description: form.description.trim(),
        shortDescription:
          form.shortDescription.trim() || form.description.trim().slice(0, 180),
        descriptionExtra: form.descriptionExtra.trim(),
        images,
        coverImageId: resolvedCover,
        highlights: form.highlights,
        features: {
          ...form.features,
          bedrooms: form.beds,
          bathrooms: form.baths,
        },
        amenities: form.amenities,
        floorPlans: (Object.keys(floorPlans) as FloorPlanType[])
          .filter((type) => floorPlans[type])
          .map((type) => ({
            type,
            name: FLOOR_PLAN_LABELS[type],
            dataUrl: floorPlans[type]!,
          })),
        videoUrl: form.videoUrl.trim() || undefined,
        faqs: form.faqs,
        mapAddress: form.mapAddress.trim() || form.address.trim(),
        ownerContact: form.ownerContact,
        nearbyLandmarks: form.nearbyLandmarks,
        agentId: initial?.agentId ?? "",
        agentName: initial?.agentName ?? "",
        agentEmail: initial?.agentEmail ?? "",
        agentAvatar: initial?.agentAvatar,
        createdBy: initial?.createdBy ?? "agent",
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not save listing.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="mb-3">
        <Card.Body>
          <h5 className="mb-3">Property Photos</h5>
          <p className="text-muted small">
            Upload gallery images. Star your cover photo — it appears on listing cards.
          </p>
          <ListingImageUpload
            images={images}
            onChange={setImages}
            coverImageId={coverImageId}
            onCoverChange={setCoverImageId}
          />
        </Card.Body>
      </Card>

      <Card className="mb-3">
        <Card.Body>
          <h5 className="mb-3">Basic Details</h5>
          <Row>
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>Property title</Form.Label>
                <Form.Control
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. 4-Bed Duplex in Maitama"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Listing type</Form.Label>
                <Form.Select
                  value={form.listingType}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      listingType: e.target.value as "sale" | "rent",
                    })
                  }
                >
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  {PROPERTY_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  value={form.price}
                  onChange={(e) => {
                    const digits = stripPriceDigits(e.target.value);
                    setForm({
                      ...form,
                      price: digits ? formatNairaPrice(digits) : "",
                    });
                  }}
                  placeholder="₦450,000,000"
                  inputMode="numeric"
                  className="listing-price-input"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Price label</Form.Label>
                <Form.Control
                  value={form.priceLabel}
                  onChange={(e) =>
                    setForm({ ...form, priceLabel: e.target.value })
                  }
                  placeholder={form.listingType === "rent" ? "per annum" : "Total"}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>City</Form.Label>
                <Form.Control
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>State</Form.Label>
                <Form.Select
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                >
                  {NIGERIAN_STATES.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Map / full address</Form.Label>
                <Form.Control
                  value={form.mapAddress}
                  onChange={(e) =>
                    setForm({ ...form, mapAddress: e.target.value })
                  }
                  placeholder="Used for Google Maps on property page"
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>Street address</Form.Label>
            <Form.Control
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Estate name, street, district"
            />
          </Form.Group>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Bedrooms</Form.Label>
                <Form.Control
                  type="number"
                  min={1}
                  value={form.beds}
                  onChange={(e) =>
                    setForm({ ...form, beds: Number(e.target.value) })
                  }
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Bathrooms</Form.Label>
                <Form.Control
                  type="number"
                  min={1}
                  value={form.baths}
                  onChange={(e) =>
                    setForm({ ...form, baths: Number(e.target.value) })
                  }
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Size (sqft)</Form.Label>
                <Form.Control
                  value={form.sqft}
                  onChange={(e) => setForm({ ...form, sqft: e.target.value })}
                  placeholder="Optional"
                />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="mb-3">
        <Card.Body>
          <h5 className="mb-3">Description</h5>
          <Form.Group className="mb-3">
            <Form.Label>Short summary</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={form.shortDescription}
              onChange={(e) =>
                setForm({ ...form, shortDescription: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Full description</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-0">
            <Form.Label>Additional notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={form.descriptionExtra}
              onChange={(e) =>
                setForm({ ...form, descriptionExtra: e.target.value })
              }
            />
          </Form.Group>
        </Card.Body>
      </Card>

      <Card className="mb-3">
        <Card.Body>
          <h5 className="mb-3">Property Features</h5>
          <Row>
            {FEATURE_TOGGLES.map(({ key, label, options }) => (
              <Col md={6} lg={4} key={key} className="mb-3">
                <Form.Label>{label}</Form.Label>
                <Form.Select
                  value={form.features[key]}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      features: { ...form.features, [key]: e.target.value },
                    })
                  }
                >
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>

      <Card className="mb-3">
        <Card.Body>
          <h5 className="mb-3">About Property</h5>
          <div className="d-flex flex-wrap gap-2">
            {ABOUT_HIGHLIGHT_OPTIONS.map((option) => (
              <Button
                key={option}
                type="button"
                size="sm"
                variant={
                  form.highlights.includes(option) ? "primary" : "outline-secondary"
                }
                onClick={() => toggleStringList("highlights", option)}
              >
                {option}
              </Button>
            ))}
          </div>
        </Card.Body>
      </Card>

      <Card className="mb-3">
        <Card.Body>
          <h5 className="mb-3">Amenities</h5>
          <div className="d-flex flex-wrap gap-2">
            {AMENITY_OPTIONS.map((option) => (
              <Button
                key={option}
                type="button"
                size="sm"
                variant={
                  form.amenities.includes(option) ? "primary" : "outline-secondary"
                }
                onClick={() => toggleStringList("amenities", option)}
              >
                {option}
              </Button>
            ))}
          </div>
        </Card.Body>
      </Card>

      <Card className="mb-3">
        <Card.Body>
          <h5 className="mb-3">Floor Plans</h5>
          <Row>
            {(Object.keys(FLOOR_PLAN_LABELS) as FloorPlanType[]).map((type) => (
              <Col md={6} key={type} className="mb-3">
                <Form.Label>{FLOOR_PLAN_LABELS[type]}</Form.Label>
                <input
                  ref={(node) => {
                    floorPlanRefs.current[type] = node;
                  }}
                  type="file"
                  accept="image/*,.pdf"
                  className="form-control"
                  onChange={(e) =>
                    handleFloorPlanUpload(type, e.target.files?.[0])
                  }
                />
                {floorPlans[type] && (
                  <img
                    src={floorPlans[type]}
                    alt={FLOOR_PLAN_LABELS[type]}
                    className="mt-2 rounded border"
                    style={{ maxHeight: 120, objectFit: "cover" }}
                  />
                )}
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>

      <Card className="mb-3">
        <Card.Body>
          <h5 className="mb-3">Video</h5>
          <Form.Group className="mb-0">
            <Form.Label>YouTube or video link</Form.Label>
            <Form.Control
              value={form.videoUrl}
              onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
              placeholder="https://youtube.com/..."
            />
          </Form.Group>
        </Card.Body>
      </Card>

      <Card className="mb-3">
        <Card.Body>
          <h5 className="mb-3">FAQ</h5>
          <div className="d-flex flex-wrap gap-2 mb-3">
            {FAQ_TEMPLATES.map((template, index) => (
              <Button
                key={template.question}
                type="button"
                size="sm"
                variant="outline-primary"
                onClick={() => addFaqTemplate(index)}
              >
                + {template.question.slice(0, 42)}…
              </Button>
            ))}
          </div>
          {form.faqs.map((faq, index) => (
            <div key={faq.id} className="border rounded p-3 mb-2">
              <Form.Group className="mb-2">
                <Form.Label>Question</Form.Label>
                <Form.Control
                  value={faq.question}
                  onChange={(e) => {
                    const faqs = [...form.faqs];
                    faqs[index] = { ...faq, question: e.target.value };
                    setForm({ ...form, faqs });
                  }}
                />
              </Form.Group>
              <Form.Group className="mb-0">
                <Form.Label>Answer</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={faq.answer}
                  onChange={(e) => {
                    const faqs = [...form.faqs];
                    faqs[index] = { ...faq, answer: e.target.value };
                    setForm({ ...form, faqs });
                  }}
                />
              </Form.Group>
            </div>
          ))}
        </Card.Body>
      </Card>

      <Card className="mb-3">
        <Card.Body>
          <h5 className="mb-3">Listing Owner Details</h5>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  value={form.ownerContact.phone ?? ""}
                  disabled={form.ownerContact.lockedByAdmin && !showOwnerLockFields}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      ownerContact: {
                        ...form.ownerContact,
                        phone: e.target.value,
                      },
                    })
                  }
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  value={form.ownerContact.email ?? ""}
                  disabled={form.ownerContact.lockedByAdmin && !showOwnerLockFields}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      ownerContact: {
                        ...form.ownerContact,
                        email: e.target.value,
                      },
                    })
                  }
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>WhatsApp link</Form.Label>
                <Form.Control
                  value={form.ownerContact.whatsapp ?? ""}
                  disabled={form.ownerContact.lockedByAdmin && !showOwnerLockFields}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      ownerContact: {
                        ...form.ownerContact,
                        whatsapp: e.target.value,
                      },
                    })
                  }
                  placeholder="https://wa.me/234..."
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  value={form.ownerContact.location ?? ""}
                  disabled={form.ownerContact.lockedByAdmin && !showOwnerLockFields}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      ownerContact: {
                        ...form.ownerContact,
                        location: e.target.value,
                      },
                    })
                  }
                />
              </Form.Group>
            </Col>
          </Row>
          {showOwnerLockFields && (
            <Row>
              <Col md={6}>
                <Form.Check
                  type="switch"
                  label="Use company contact details"
                  checked={form.ownerContact.useCompanyDetails ?? false}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      ownerContact: {
                        ...form.ownerContact,
                        useCompanyDetails: e.target.checked,
                      },
                    })
                  }
                />
              </Col>
              <Col md={6}>
                <Form.Check
                  type="switch"
                  label="Lock contact — agent cannot edit"
                  checked={form.ownerContact.lockedByAdmin ?? false}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      ownerContact: {
                        ...form.ownerContact,
                        lockedByAdmin: e.target.checked,
                      },
                    })
                  }
                />
              </Col>
            </Row>
          )}
        </Card.Body>
      </Card>

      <Button type="submit" variant="primary" disabled={submitting}>
        {submitting ? "Saving..." : submitLabel}
      </Button>
    </Form>
  );
};

export default ListingForm;
