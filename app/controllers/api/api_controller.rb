class Api::ApiController < ApplicationController

  def error_response(message, status = 204)
    render(
      json: {
        data:    '',
        status:  status,
        message: message
      }
    )
  end

  def success_response(data, status = 200)
    if data.blank?
      data = {}
    end
    render(
      json: data
    )
  end

  def controller_params_options(params, column, conditions, condition_type)
    if !params.blank?
      conditions[0] = conditions[0].to_s + (conditions[0].blank? ? "" : " and ") + "#{column} #{condition_type} ?"
      if condition_type == "like"
        conditions << "%#{params}%"
      else
        conditions << params
      end
    end
  end
end
