from testing_script import Tester

def test_regex():
    json = {
        "tests": [
            {
                "name": "regex test",
                "type": "regex",
                "feedback": "oops",
                "info": {
                    "string": "print\\s*\\(\\s*.*\\)"
                }
            }
        ]
    }
    code_to_test = "print('hlleo world')"
    tester = Tester(code_to_test, "", json)
    output = tester.get_result()
    print(output)
    return
    expected = []
    assert output == expected

test_regex()