module ApplicationHelper
  def select_genre_data
    Genre.order(
      :name
    ).pluck(
      :name,
      :id
    )
  end

  def select_difficulty_data
    Difficulty.order(
      :id
    ).pluck(
      :name,
      :id
    )
  end
end
