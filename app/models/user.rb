class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  
  # Un utilizator poate organiza mai multe evenimente
  has_many :organized_events, class_name: 'Event', foreign_key: 'organizer_id'
  
  # Un utilizator poate participa la mai multe evenimente prin înregistrări
  has_many :registrations
  has_many :attending_events, through: :registrations, source: :event
end
