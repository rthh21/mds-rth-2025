class CreateOrganizers < ActiveRecord::Migration[6.0]
  def change
    create_table :organizers do |t|
      # fields for the organizer
      t.timestamps
    end
  end
end
