from scipy.stats import chi2_contingency
import matplotlib.pyplot as plt
data = {
    "Q1_Trump": [[25, 15], [20, 20]],
    "Q2_Harris": [[20, 20], [20, 20]],
    "Q3_Trump": [[18, 22], [20, 20]],
    "Q4_Harris": [[30, 10], [20, 20]],
    "Q5_Trump": [[35, 5], [20, 20]],
    "Q6_Harris": [[28, 12], [20, 20]],
    "Q7_Trump": [[22, 18], [20, 20]],
    "Q8_Harris": [[24, 16], [20, 20]],
    "Q9_Trump": [[20, 20], [20, 20]],
    "Q10_Harris": [[26, 14], [20, 20]],
}

def calculate_chi_square(data):
    results = {}
    for question, observed_expected in data.items():
        observed = observed_expected[0]
        expected = observed_expected[1]
        chi2_stat, p_value, _, _ = chi2_contingency([observed, expected])
        null_hypothesis = "Reject" if p_value < 0.05 else "Fail to Reject"
        results[question] = {
            "Chi2": chi2_stat,
            "P-Value": p_value,
            "Null Hypothesis": null_hypothesis
        }
    return results
results = calculate_chi_square(data)
questions = list(results.keys())
chi2_values = [result["Chi2"] for result in results.values()]
p_values = [result["P-Value"] for result in results.values()]
null_hypothesis_status = [result["Null Hypothesis"] for result in results.values()]

# Beautified Chi-Square Plot
plt.figure(figsize=(12, 6))
plt.bar(questions, chi2_values, color="royalblue", edgecolor="black")
plt.xlabel("Questions", fontsize=14)
plt.ylabel("Chi-Square Values", fontsize=14)
plt.title("Chi-Square Values for Each Question", fontsize=16, fontweight="bold")
plt.xticks(rotation=45, ha="right", fontsize=12)
plt.yticks(fontsize=12)
plt.grid(axis="y", linestyle="--", alpha=0.7)
plt.tight_layout()
plt.show()

# Beautified P-Values Plot
plt.figure(figsize=(12, 6))
plt.bar(questions, p_values, color="limegreen", edgecolor="black")
plt.xlabel("Questions", fontsize=14)
plt.ylabel("P-Values", fontsize=14)
plt.title("P-Values for Each Question", fontsize=16, fontweight="bold")
plt.axhline(y=0.05, color="red", linestyle="--", label="Significance Threshold (0.05)")
plt.xticks(rotation=45, ha="right", fontsize=12)
plt.yticks(fontsize=12)
plt.legend(fontsize=12)
plt.grid(axis="y", linestyle="--", alpha=0.7)
plt.tight_layout()
plt.show()

