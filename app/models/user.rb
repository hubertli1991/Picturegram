class User < ActiveRecord::Base

  validates :session_token, presence: true
  # reduce the number of validations to ensure OmniAuth
  validates :password, length: {minimum: 6, allow_nil: true}

  validates :username, uniqueness: true
  validates :username, length: {minimum: 1}

  has_attached_file :profile_picture, styles: { regular: "150x150>", thumb_nail: "50x50>" }, default_url: "facebook-profile-picture-silhouette-i3.jpg"
  validates_attachment_content_type :profile_picture, content_type: /\Aimage\/.*\Z/

  has_many :posts

  has_many(
    :followings,
    primary_key: :id,
    foreign_key: :user_id,
    class_name: "Following"
  )

  has_many(
    :followees,
    through: :followings,
    source: :followee
  )

  has_many(
    :followeds,
    primary_key: :id,
    foreign_key: :following_id,
    class_name: "Following"
  )

  has_many(
    :followers,
    through: :followeds,
    source: :user
  )

  has_many(
    :followees_posts,
    through: :followees,
    source: :posts
  )

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
