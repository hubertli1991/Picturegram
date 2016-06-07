Rails.application.config.middleware.use OmniAuth::Builder do
  provider :facebook, ENV["facebook_api_key"], ENV["facebook_secret"]
end
