# Run tests after code is complete

import re

class Tester:
    def __init__(self, code_to_check, console_output, json_file):
        self.code_to_check = code_to_check
        self.console_output = console_output
        self.type_mapper = {
            "regex": self.run_regex_test,
            "output": self.run_output_test,
            "function": self.run_function_test
        }
        self.output = []

        self.run_tests(json_file['tests'])

    def run_tests(self, test_cases):
        for test_case in test_cases:
            try:
                result = self.run_test_case(test_case)
                self.add_result(test_case, result)
            except Exception as error:
                print(error)
                continue
    
    def run_test_case(self, test_case):
        test_type = test_case['type']
        test_to_run = self.type_mapper[test_type]
        return test_to_run(test_case['info'])

    def add_result(self, test_case, result):
        if result == "success":
            self.add_to_output(test_case['name'], "success")
        else:
            self.add_to_output(test_case['name'], "fail", test_case['feedback'])
    
    def run_regex_test(self, data):
        pattern = data['string']
        # test_string = r'{}'.format(self.code_to_check)
        test_string = self.code_to_check
        if re.search(pattern, test_string):
            return "success"
        else:
            return "fail"

    def run_output_test(self, data):
        return "fail"

    def run_function_test(self, data):
        return "fail"

    def add_to_output(self, name, result, feedback=None):
        test_result = {
            "name": name,
            "result": result,
        }
        if feedback != None:
            test_result["feedback"] = feedback
        self.output.append(test_result)

    def get_result(self):
        return self.output
