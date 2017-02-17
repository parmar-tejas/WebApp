class Api::V1::AutocompletesController < Api::ApiController

  def get_select_data
    data = {}
    data["genere"]     = Genere.all
    data["difficulty"] = Difficulty.all
    success_response(data)
  end
end