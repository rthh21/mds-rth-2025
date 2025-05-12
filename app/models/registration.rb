class Registration < ApplicationRecord
  belongs_to :user
  belongs_to :event
  
  # Validări pentru înregistrări
  validates :user_id, :event_id, presence: true
  validates :user_id, uniqueness: { scope: :event_id, message: "este deja înscris la acest eveniment" }
end
