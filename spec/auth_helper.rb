
module AuthHelper
    USERNAME = 'ftokarev'
    PASSWORD = ''
    EMAIL = 'fedor.tokarev@t-systems.com'
    UID = 1356
    GROUP_ID = 2

    def json_body
        JSON.parse(response.body)
    end
end