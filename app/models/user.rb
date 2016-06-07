class User < ActiveRecord::Base

  validates :session_token, presence: true
  validates :password, length: {minimum: 6, allow_nil: true}

  has_many :posts
  has_many :followers

  after_initialize :ensure_session_token

  attr_reader :password

  def self.find_by_credentials(username, password)
    user = User.find_by(username: username)
    return nil unless user
    user.is_password?(password) ? user : nil
  end

  def self.find_or_create_with_auth_hash(auth_hash)
    user = User.find_by(facebook_uid: auth_hash[:uid])
    if user.nil?
      user = User.create(
        facebook_uid: auth_hash[:uid],
        username: auth_hash[:info][:name]
      )
    end
    user
  end

  def password=(password)
    @password = password
    self.password_digest = BCrypt::Password.create(password)
  end

  def is_password?(password)
    BCrypt::Password.new(self.password_digest).is_password?(password)
  end

  def reset_session_token
    self.session_token = SecureRandom.urlsafe_base64(16)
    self.save
    self.session_token
  end

  def ensure_session_token
    self.session_token ||= SecureRandom.urlsafe_base64(16)
  end

end
