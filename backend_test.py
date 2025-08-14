import requests
import sys
from datetime import datetime

class BlessedGratefulAPITester:
    def __init__(self, base_url="https://neutral-wisdom.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0

    def run_test(self, name, method, endpoint, expected_status, data=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}" if endpoint else self.base_url
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)

            print(f"Response Status: {response.status_code}")
            print(f"Response Body: {response.text[:500]}...")

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")

            return success, response.json() if response.headers.get('content-type', '').startswith('application/json') else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_health_check(self):
        """Test the root API endpoint"""
        success, response = self.run_test(
            "API Health Check",
            "GET",
            "",
            200
        )
        if success and response.get('message') == 'Hello World':
            print("✅ Health check message correct")
            return True
        elif success:
            print(f"⚠️ Health check returned unexpected message: {response}")
            return False
        return False

    def test_contact_submission(self):
        """Test contact form submission"""
        test_data = {
            "name": "Test User",
            "email": "test@example.com",
            "subject": "Hello",
            "message": "This is a test"
        }
        
        success, response = self.run_test(
            "Contact Form Submission",
            "POST",
            "contact",
            200,
            data=test_data
        )
        
        if success and response.get('success') is True:
            message = response.get('message', '')
            if 'Message sent successfully' in message or 'Message received. We will follow up soon' in message:
                print(f"✅ Contact submission successful with message: {message}")
                return True
            else:
                print(f"⚠️ Unexpected success message: {message}")
                return False
        return False

    def test_talk_endpoint(self):
        """Test the /api/talk endpoint"""
        test_data = {
            "prompt": "Hello, I need some guidance today."
        }
        
        success, response = self.run_test(
            "Talk Endpoint",
            "POST",
            "talk",
            200,
            data=test_data
        )
        
        if success and 'reply' in response:
            reply = response.get('reply', '')
            if reply and len(reply) > 10:  # Basic check for meaningful response
                print(f"✅ Talk endpoint returned reply: {reply[:100]}...")
                # Check that no API keys are exposed in the response
                sensitive_terms = ['api_key', 'openai', 'sk-', 'OPENAI_API_KEY']
                if any(term.lower() in reply.lower() for term in sensitive_terms):
                    print("⚠️ Warning: Response may contain sensitive information")
                    return False
                return True
            else:
                print(f"⚠️ Talk endpoint returned empty or short reply: {reply}")
                return False
        return False

def main():
    print("🚀 Starting Blessed & Grateful API Tests")
    print("=" * 50)
    
    # Setup
    tester = BlessedGratefulAPITester()
    
    # Run tests
    print("\n📡 Testing API Health...")
    health_ok = tester.test_health_check()
    
    print("\n📧 Testing Contact Form...")
    contact_ok = tester.test_contact_submission()
    
    # Print results
    print("\n" + "=" * 50)
    print(f"📊 Tests passed: {tester.tests_passed}/{tester.tests_run}")
    
    if health_ok and contact_ok:
        print("🎉 All critical API tests passed!")
        return 0
    else:
        print("❌ Some API tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())