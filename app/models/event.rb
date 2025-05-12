class Event < ApplicationRecord
  belongs_to :organizer, class_name: 'User'
  
  # Un eveniment poate avea mai mulți participanți
  has_many :registrations
  has_many :attendees, through: :registrations, source: :user
  
  # Validări pentru a asigura date corecte
  validates :title, :start_time, :end_time, presence: true
  validate :end_time_after_start_time
  
  private
  
  def end_time_after_start_time
    if end_time <= start_time
      errors.add(:end_time, "trebuie să fie după ora de început")
    end
  end
end

class Event < ApplicationRecord
  # Validări simple
  validates :title, presence: true, length: { minimum: 5, maximum: 100 }
  validates :description, presence: true
  validates :start_time, :end_time, presence: true
  
  # Validare personalizată pentru data de sfârșit
  validate :end_time_after_start_time
  
  # Validare pentru numărul minim de participanți (opțional)
  validates_presence_of :registrations, message: "Evenimentul trebuie să aibă cel puțin un participant"
  
  private
  
  def end_time_after_start_time
    return if start_time.blank? || end_time.blank?
    
    if end_time <= start_time
      errors.add(:end_time, "nu poate fi înainte sau egală cu ora de început")
    end
  end
end
