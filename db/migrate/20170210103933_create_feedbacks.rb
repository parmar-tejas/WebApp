class CreateFeedbacks < ActiveRecord::Migration[5.0]
  def change
    create_table :feedbacks do |t|
      t.datetime :timestamp
      t.string   :email
      t.string   :message
      t.timestamps
    end
  end
end
