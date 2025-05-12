class CreateEvents < ActiveRecord::Migration[6.1]
  def change
    create_table :events do |t|
      t.references :organizer, null: false, foreign_key: true
      t.string :title,      null: false
      t.datetime :starts_at
      t.string :location
      t.timestamps
    end
  end
end