ActiveAdmin.register Difficulty do
  permit_params(
    :name
  )

  index do
    selectable_column
    id_column
    column :name
    actions
  end

  filter :name

  form do |f|
    f.inputs "Difficulty" do
     f.input :name
    end
    f.actions
  end

  show do |difficulty|
    panel "Difficulty" do
      attributes_table_for difficulty do
        row :name
      end
    end
  end
end
