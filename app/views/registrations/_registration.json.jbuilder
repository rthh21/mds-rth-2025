json.extract! registration, :id, :user_id, :event_id, :status, :created_at, :updated_at
json.url registration_url(registration, format: :json)
