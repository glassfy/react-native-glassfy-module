require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-glassfyui-module"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => "10.0" }
  s.source       = { :git => "https://github.com/glassfy/react-native-glassfy-module.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,mm}"

  s.dependency "React-Core"
  s.dependency "Glassfy", "1.4.0"
  s.dependency "GlassfyGlue", "1.4.1"
end
