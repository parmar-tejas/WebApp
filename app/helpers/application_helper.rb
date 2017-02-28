module ApplicationHelper
  def select_genre_data
    Genre.pluck(
      :name,
      :id
    )
  end

  def select_difficulty_data
    Difficulty.pluck(
      :name,
      :id
    )
  end
end
