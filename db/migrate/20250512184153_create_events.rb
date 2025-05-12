class CreateEvents < ActiveRecord::Migration[6.0]
  def change
    create_table :events do |t|
      t.references :organizer, foreign_key: true
      # other fields
      t.timestamps
    end
  end
end
