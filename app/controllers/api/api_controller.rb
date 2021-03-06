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
end
